# 🚀 N8N Workflow Automation với Docker

Hướng dẫn cài đặt và chạy n8n trên máy local sử dụng Docker.

## 📋 Yêu cầu hệ thống

- Docker và Docker Compose đã được cài đặt
- Ít nhất 2GB RAM trống
- Port 5678, 5432, 6379 chưa được sử dụng

## ⚡ Cài đặt nhanh (Khuyến nghị)

### Bước 1: Khởi động n8n với phiên bản đơn giản
```bash
docker-compose -f docker-compose.simple.yml up -d
```

### Bước 2: Truy cập n8n
- **URL:** http://localhost:5678
- **Username:** admin
- **Password:** admin123

### Bước 3: Dừng n8n
```bash
docker-compose -f docker-compose.simple.yml down
```

## 🏗️ Cài đặt đầy đủ với PostgreSQL

### Bước 1: Khởi động với database đầy đủ
```bash
docker-compose -f docker-compose.n8n.yml up -d
```

### Bước 2: Kiểm tra logs
```bash
docker-compose -f docker-compose.n8n.yml logs -f n8n
```

### Bước 3: Truy cập n8n
- **URL:** http://localhost:5678
- **Username:** admin
- **Password:** admin123

## 🛠️ Các lệnh Docker hữu ích

### Quản lý containers
```bash
# Xem trạng thái containers
docker-compose -f docker-compose.n8n.yml ps

# Restart n8n
docker-compose -f docker-compose.n8n.yml restart n8n

# Xem logs
docker-compose -f docker-compose.n8n.yml logs -f

# Dừng và xóa containers
docker-compose -f docker-compose.n8n.yml down

# Dừng và xóa containers + volumes (xóa dữ liệu)
docker-compose -f docker-compose.n8n.yml down -v
```

### Backup và Restore
```bash
# Backup dữ liệu
docker run --rm -v n8n_n8n_data:/data -v $(pwd):/backup alpine tar czf /backup/n8n-backup.tar.gz -C /data .

# Restore dữ liệu
docker run --rm -v n8n_n8n_data:/data -v $(pwd):/backup alpine tar xzf /backup/n8n-backup.tar.gz -C /data
```

## ⚙️ Cấu hình nâng cao

### Thay đổi cổng mặc định
Sửa file `docker-compose.n8n.yml`:
```yaml
ports:
  - "8080:5678"  # Thay 5678 thành cổng mong muốn
```

### Thay đổi thông tin đăng nhập
Sửa environment variables:
```yaml
environment:
  - N8N_BASIC_AUTH_USER=your_username
  - N8N_BASIC_AUTH_PASSWORD=your_secure_password
```

### Kết nối với external database
```yaml
environment:
  - DB_TYPE=postgresdb
  - DB_POSTGRESDB_HOST=your-external-host
  - DB_POSTGRESDB_PORT=5432
  - DB_POSTGRESDB_DATABASE=your_database
  - DB_POSTGRESDB_USER=your_user
  - DB_POSTGRESDB_PASSWORD=your_password
```

## 🔧 Troubleshooting

### Lỗi thường gặp

1. **Port đã được sử dụng**
   ```bash
   # Kiểm tra port
   lsof -i :5678

   # Thay đổi port trong docker-compose.yml
   ports:
     - "5679:5678"
   ```

2. **Không thể kết nối database**
   ```bash
   # Kiểm tra logs PostgreSQL
   docker-compose -f docker-compose.n8n.yml logs postgres

   # Restart database
   docker-compose -f docker-compose.n8n.yml restart postgres
   ```

3. **n8n không khởi động được**
   ```bash
   # Kiểm tra logs n8n
   docker-compose -f docker-compose.n8n.yml logs n8n

   # Xóa và tạo lại container
   docker-compose -f docker-compose.n8n.yml down
   docker-compose -f docker-compose.n8n.yml up --force-recreate
   ```

## 📚 Sử dụng n8n

### Tạo workflow đầu tiên
1. Đăng nhập vào n8n
2. Nhấp "Add first step"
3. Chọn một trigger (vd: Webhook, Schedule)
4. Thêm các node khác để xử lý dữ liệu
5. Kiểm tra và chạy workflow

### Các tính năng phổ biến
- **HTTP Request:** Gọi API
- **Email:** Gửi email
- **Database:** Kết nối database
- **File operations:** Xử lý file
- **AI/ML:** Tích hợp với OpenAI, Anthropic
- **Social Media:** Tương tác với Twitter, Discord

## 🔒 Bảo mật

### Thay đổi mật khẩu mặc định
```bash
# Trong docker-compose.yml
environment:
  - N8N_BASIC_AUTH_ACTIVE=true
  - N8N_BASIC_AUTH_USER=secure_username
  - N8N_BASIC_AUTH_PASSWORD=very_secure_password
```

### Vô hiệu hóa basic auth (không khuyến nghị cho production)
```yaml
environment:
  - N8N_BASIC_AUTH_ACTIVE=false
```

## 📊 Giám sát

### Kiểm tra tài nguyên sử dụng
```bash
# RAM và CPU usage
docker stats

# Disk usage
docker system df
```

### Logs và debugging
```bash
# Xem logs real-time
docker-compose -f docker-compose.n8n.yml logs -f n8n

# Xem logs của PostgreSQL
docker-compose -f docker-compose.n8n.yml logs -f postgres
```

## 🚀 Production Deployment

Để deploy n8n lên production, xem xét:
- Sử dụng reverse proxy (Nginx)
- Cấu hình SSL/TLS
- Database clustering
- Redis clustering
- Backup strategy
- Monitoring và alerting

## 📞 Hỗ trợ

- **Documentation:** https://docs.n8n.io/
- **Community:** https://community.n8n.io/
- **GitHub:** https://github.com/n8n-io/n8n

## 🎯 Quick Commands

```bash
# Start n8n simple
docker-compose -f docker-compose.simple.yml up -d

# Start n8n full
docker-compose -f docker-compose.n8n.yml up -d

# Stop all
docker-compose -f docker-compose.simple.yml down
docker-compose -f docker-compose.n8n.yml down

# Clean up
docker system prune -a
```
