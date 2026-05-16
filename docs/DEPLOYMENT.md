# GATES-CARE — AWS Deployment Guide

> Server: AWS EC2 **t3.small** · OS: **Ubuntu 24.04 LTS**
> Stack: Node.js 22 · PostgreSQL 16 · Nginx · Certbot
> Domain: **www.gatesinnov.com** (root + admin subdomain)
> Capacity target: 50 concurrent users · No Redis · No SMTP
>
> This guide is sequential — follow phases A → H in order.
> Estimated time on AWS console + first server boot: 60–90 minutes.

---

## Cost estimate (monthly, US-East-1)

| Item | Cost |
|------|------|
| t3.small on-demand (730h) | ~$15 |
| t3.small 1-year reserved (recommended) | ~$9 |
| EBS gp3 30GB | ~$2.40 |
| Elastic IP (attached, always) | free |
| Data transfer 50GB out | ~$4.50 |
| S3 backup storage (5GB) | ~$0.12 |
| Route 53 hosted zone | $0.50 |
| **Total estimate** | **~$17–22 / month** |

Switch to 1-year reserved instance after Phase B confirms everything works.

---

## Prerequisites (do these BEFORE the EC2 work)

- [ ] AWS account active, billing alarm set ($25 threshold)
- [ ] Domain `gatesinnov.com` registered (anywhere — Namecheap, GoDaddy, AWS Route 53)
- [ ] SSH key pair generated locally (`ssh-keygen -t ed25519 -C "gates-deploy"`)
- [ ] AWS IAM user with EC2 + Route 53 + S3 permissions (NOT root account)
- [ ] AWS CLI v2 installed locally (optional but useful)

---

## Phase A — Launch EC2 Instance

### A1. Choose region
- **us-east-1 (N. Virginia)** — cheapest, most services
- **eu-south-1 (Milan)** — closer to Egypt, ~50ms lower latency for your customers
- Pick eu-south-1 if cost difference is acceptable.

### A2. Launch instance
1. EC2 → Launch Instance
2. **Name:** `gates-helpdesk-prod`
3. **AMI:** Ubuntu Server **24.04 LTS** (HVM, SSD) — 64-bit (x86)
4. **Instance type:** `t3.small` (2 vCPU, 2 GB RAM)
5. **Key pair:** Create new → name `gates-deploy` → download `.pem`
6. **Network settings:**
   - VPC: default
   - Auto-assign public IP: enable (we'll replace with Elastic IP)
7. **Security group:** create new — `gates-helpdesk-sg`
   - Inbound rules:
     - SSH (22) — Source: **My IP only** (NOT 0.0.0.0/0)
     - HTTP (80) — Source: 0.0.0.0/0
     - HTTPS (443) — Source: 0.0.0.0/0
   - Outbound: allow all (default)
8. **Storage:** 30 GB **gp3** (not gp2 — gp3 is cheaper and faster)
9. Advanced → User data: leave empty
10. Launch

### A3. Verify
SSH from local terminal once instance state is "Running":
```bash
chmod 400 ~/Downloads/gates-deploy.pem
ssh -i ~/Downloads/gates-deploy.pem ubuntu@<PUBLIC_IP>
```

If prompted, type `yes`. You should land in the Ubuntu shell.

---

## Phase B — Elastic IP + DNS

### B1. Allocate Elastic IP
1. EC2 → Elastic IPs → **Allocate**
2. Default settings → Allocate
3. Select the new IP → Actions → **Associate**
4. Instance: `gates-helpdesk-prod` → Associate
5. **Write this IP down** — it's your static IP for life.

### B2. Point domain to server
You have two options:

**Option 1 — Use registrar's DNS (simplest)**
Add A records at your domain registrar:
```
@           A    <ELASTIC_IP>     TTL 3600
www         A    <ELASTIC_IP>     TTL 3600
app         A    <ELASTIC_IP>     TTL 3600
admin       A    <ELASTIC_IP>     TTL 3600
api         A    <ELASTIC_IP>     TTL 3600
```

**Option 2 — Migrate to Route 53 (~$0.50/month, more control)**
1. Route 53 → Hosted zones → Create hosted zone → `gatesinnov.com`
2. Copy the 4 NS records AWS gives you
3. At your registrar, change nameservers to those 4
4. Wait 30 min – 24h for propagation
5. In Route 53, add the A records above

### B3. Verify DNS
From local terminal:
```bash
dig gatesinnov.com +short
dig www.gatesinnov.com +short
dig admin.gatesinnov.com +short
```
All four should return your Elastic IP. If not, wait longer.

---

## Phase C — Base Server Setup

SSH in: `ssh -i ~/Downloads/gates-deploy.pem ubuntu@<ELASTIC_IP>`

### C1. Update system
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget gnupg2 software-properties-common build-essential ufw fail2ban unattended-upgrades
```

### C2. Set hostname + timezone
```bash
sudo hostnamectl set-hostname gates-helpdesk
sudo timedatectl set-timezone Africa/Cairo
```

### C3. Create swap file (CRITICAL for t3.small — 2GB RAM is tight)
```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
sudo sysctl vm.swappiness=10
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
```

### C4. Firewall (ufw)
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
sudo ufw status
```

### C5. fail2ban (auto-ban brute force attempts)
```bash
sudo systemctl enable --now fail2ban
sudo systemctl status fail2ban
```

### C6. Automatic security updates
```bash
sudo dpkg-reconfigure --priority=low unattended-upgrades
```
Choose **Yes** to enable.

### C7. Disable root SSH + password auth
Edit `/etc/ssh/sshd_config`:
```bash
sudo nano /etc/ssh/sshd_config
```
Set:
```
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
```
Save (Ctrl+O, Enter, Ctrl+X), then:
```bash
sudo systemctl restart ssh
```
**Test in a new terminal window** that you can still SSH in BEFORE closing this one.

### C8. Create deploy user (don't run apps as ubuntu)
```bash
sudo adduser gates --disabled-password --gecos ""
sudo usermod -aG sudo gates
sudo mkdir -p /home/gates/.ssh
sudo cp ~/.ssh/authorized_keys /home/gates/.ssh/
sudo chown -R gates:gates /home/gates/.ssh
sudo chmod 700 /home/gates/.ssh
sudo chmod 600 /home/gates/.ssh/authorized_keys
```

Future SSH: `ssh -i ~/.../gates-deploy.pem gates@<ELASTIC_IP>`

---

## Phase D — Install Runtime Dependencies

Switch to gates user: `sudo su - gates`

### D1. Node.js 22 LTS (via nvm)
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc
nvm install 22
nvm alias default 22
node -v   # should print v22.x.x
npm -v
```

### D2. pm2 (process manager — keeps Node alive on crash + reboot)
```bash
npm install -g pm2
pm2 startup systemd     # follow the printed sudo command
```

### D3. Git
```bash
sudo apt install -y git
git config --global user.name "gates-deploy"
git config --global user.email "deploy@gatesinnov.com"
```

---

## Phase E — PostgreSQL 16

### E1. Install
```bash
sudo apt install -y postgresql-16 postgresql-contrib-16
sudo systemctl enable --now postgresql
psql --version
```

### E2. Create app DB + user
```bash
sudo -u postgres psql
```
Inside psql:
```sql
CREATE USER gates_app WITH PASSWORD 'STRONG_PASSWORD_HERE_CHANGE_ME';
CREATE DATABASE gates_helpdesk OWNER gates_app;
GRANT ALL PRIVILEGES ON DATABASE gates_helpdesk TO gates_app;
\q
```

Save the password in a password manager. Will go in your `.env` later.

### E3. Tune for t3.small (2GB RAM)
Edit `/etc/postgresql/16/main/postgresql.conf`:
```bash
sudo nano /etc/postgresql/16/main/postgresql.conf
```
Change these values:
```
shared_buffers = 512MB
effective_cache_size = 1GB
work_mem = 4MB
maintenance_work_mem = 64MB
max_connections = 50
```
Restart:
```bash
sudo systemctl restart postgresql
```

### E4. Test connection
```bash
psql -U gates_app -d gates_helpdesk -h localhost
```
Type the password. You should be inside psql. Type `\q` to exit.

---

## Phase F — Nginx + SSL

### F1. Install nginx
```bash
sudo apt install -y nginx
sudo systemctl enable --now nginx
```
Visit `http://<ELASTIC_IP>` in a browser — you should see "Welcome to nginx".

### F2. Site config — customer site (gatesinnov.com + www)
```bash
sudo nano /etc/nginx/sites-available/gates-customer
```
Paste:
```nginx
server {
    listen 80;
    server_name gatesinnov.com www.gatesinnov.com app.gatesinnov.com;

    # Frontend: static Vue build served from disk
    root /home/gates/gates-helpdesk/dist;
    index index.html;

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WhatsApp webhooks
    location /webhooks/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    client_max_body_size 50M;   # for ticket file uploads
}
```

### F3. Site config — admin (admin.gatesinnov.com)
```bash
sudo nano /etc/nginx/sites-available/gates-admin
```
Paste:
```nginx
server {
    listen 80;
    server_name admin.gatesinnov.com;

    # IP allowlist for extra safety (uncomment + add your IPs once known)
    # allow 197.x.x.x;       # office IP
    # deny all;

    root /home/gates/gates-admin/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### F4. Enable sites + reload
```bash
sudo ln -s /etc/nginx/sites-available/gates-customer /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/gates-admin /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### F5. SSL via Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d gatesinnov.com -d www.gatesinnov.com -d app.gatesinnov.com -d admin.gatesinnov.com
```
- Provide email when asked
- Accept TOS
- Redirect HTTP → HTTPS: **Yes**

Auto-renewal is installed automatically. Test it:
```bash
sudo certbot renew --dry-run
```

---

## Phase G — Backup Strategy

### G1. S3 bucket for backups
1. AWS Console → S3 → Create bucket
2. Name: `gates-helpdesk-backups-XXXX` (must be globally unique — add random suffix)
3. Region: same as EC2
4. Block all public access: **YES**
5. Versioning: **Enable** (protects against accidental delete)
6. Default encryption: SSE-S3
7. Create

### G2. IAM user for backups
1. IAM → Users → Create user → `gates-backup-s3`
2. Permissions: attach inline policy:
```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": ["s3:PutObject", "s3:GetObject", "s3:ListBucket"],
    "Resource": [
      "arn:aws:s3:::gates-helpdesk-backups-XXXX",
      "arn:aws:s3:::gates-helpdesk-backups-XXXX/*"
    ]
  }]
}
```
3. Create access key → download CSV → store secret in password manager

### G3. Install AWS CLI on server
```bash
sudo apt install -y awscli
aws configure
# Paste access key + secret + region (us-east-1 or eu-south-1)
```

### G4. Backup script
```bash
nano ~/backup.sh
```
Paste:
```bash
#!/bin/bash
set -e
TIMESTAMP=$(date +%Y-%m-%d_%H-%M)
BACKUP_FILE="/tmp/gates-db-$TIMESTAMP.sql.gz"
S3_BUCKET="gates-helpdesk-backups-XXXX"

pg_dump -U gates_app -h localhost gates_helpdesk | gzip > "$BACKUP_FILE"
aws s3 cp "$BACKUP_FILE" "s3://$S3_BUCKET/postgres/" --storage-class STANDARD_IA
rm "$BACKUP_FILE"

# Keep only last 30 days in S3
aws s3 ls "s3://$S3_BUCKET/postgres/" | awk '{print $4}' | sort | head -n -30 | \
  while read f; do aws s3 rm "s3://$S3_BUCKET/postgres/$f"; done
```
Make executable + add password:
```bash
chmod +x ~/backup.sh
# Add password to .pgpass so pg_dump doesn't prompt:
echo "localhost:5432:gates_helpdesk:gates_app:STRONG_PASSWORD_HERE_CHANGE_ME" > ~/.pgpass
chmod 600 ~/.pgpass
```

Test:
```bash
~/backup.sh
aws s3 ls s3://gates-helpdesk-backups-XXXX/postgres/
```

### G5. Schedule daily at 03:00
```bash
crontab -e
```
Add:
```
0 3 * * * /home/gates/backup.sh >> /home/gates/backup.log 2>&1
```

---

## Phase H — Future Setup (do later, NOT now)

### H1. coturn TURN server (for WebRTC Calls — Phase 4)
```bash
sudo apt install -y coturn
# Config in /etc/turnserver.conf
# Open UDP 3478 + UDP 49152-65535 in security group
# Consider separate instance if WebRTC traffic gets heavy
```

### H2. Monitoring
- **Free option:** Server-side logs via pino → CloudWatch Logs (~$0.50/GB)
- **Self-hosted:** Add Grafana + Loki on the same server (light footprint)
- Set CloudWatch alarms on CPU > 80%, disk > 85%, instance status check fails

### H3. CDN (CloudFront in front of nginx)
Only needed if you scale past 50 concurrent OR have users far from your AWS region.
For now: skip.

### H4. Switch to Reserved Instance
After 1-2 weeks of running and confirming stability:
1. EC2 → Reserved Instances → Purchase
2. 1-year, no upfront, t3.small → saves ~40%

---

## Useful daily commands

```bash
# Check service status
sudo systemctl status nginx postgresql

# Check pm2 apps
pm2 list
pm2 logs gates-api

# Watch system resources
htop
df -h
free -h

# Postgres connection check
psql -U gates_app -d gates_helpdesk -h localhost

# Nginx reload after config change
sudo nginx -t && sudo systemctl reload nginx

# View SSL renewal status
sudo certbot certificates

# Manual backup
~/backup.sh

# Test SSH timeout (verify firewall):
ssh -v -i ~/.../gates-deploy.pem gates@<ELASTIC_IP>
```

---

## What's NOT in this guide (intentional)

- **Application deployment** — that comes after backend is built (Phase 3 of TODO.md). At that point you'll `git clone`, `npm install`, `pm2 start`.
- **Docker Compose alternative** — possible but adds complexity. Direct install is leaner for t3.small.
- **CI/CD pipeline** — manual `git pull` + `pm2 restart` is enough for 50-user scale.
- **Database migrations** — handled by Prisma later in Phase 3.

---

## Sanity checks before declaring "ready"

- [ ] Can SSH in as `gates` user with key, NOT as ubuntu, NOT with password
- [ ] `https://gatesinnov.com` shows SSL padlock + serves a placeholder page
- [ ] `https://admin.gatesinnov.com` resolves (404 from nginx is fine — no admin app yet)
- [ ] `psql -U gates_app -d gates_helpdesk -h localhost` connects with password
- [ ] Manual `~/backup.sh` puts a `.sql.gz` in S3
- [ ] Cron `0 3 * * *` is scheduled
- [ ] `sudo ufw status` shows only 22, 80, 443 open
- [ ] `free -h` shows 2GB swap active
- [ ] EC2 billing dashboard shows $0 unexpected charges after 48h

When all 9 boxes are checked, the server is ready to receive the actual app code (which comes later from Phase 3 of TODO.md).

---

## If something goes wrong

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| `dig` returns nothing | DNS not propagated | Wait up to 24h, verify NS records at registrar |
| Certbot fails | DNS not pointing to server | Re-check Phase B before retrying |
| `psql` connection refused | Postgres not listening on localhost | Check `listen_addresses` in postgresql.conf |
| Out of memory crashes | Swap not active | Re-run Phase C3 |
| nginx 502 Bad Gateway | Backend not running on :3001 | `pm2 list` — start it |
| SSH locked out | Firewall blocked your IP change | EC2 Console → "Connect" tab → Session Manager |

Always use **Session Manager** (EC2 → Connect → Session Manager) as fallback if SSH breaks — it goes through AWS's API and bypasses your security group.
