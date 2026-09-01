# HUONG DAN TICH HOP OWASP DEPENDENCY-CHECK VA THIET LAP NGUONG CHAN CVSS SCORE

## 1. Tong quan ve OWASP Dependency-Check va Co che Phan tich CVE

OWASP Dependency-Check la cong cu Software Composition Analysis (SCA) ma nguon mo giup tu dong nhan dien cac lo hong bao mat da biet (Common Vulnerabilities and Exposures - CVE) trong cac thu vien phu thuoc cua du an phan mem (Node.js npm, Java Maven/Gradle, Python pip, .NET NuGet, v.v.).

Cong cu hoat dong bang cach thu thap thong tin nhan dang (CPE - Common Platform Enumeration) cua tung thu vien phu thuoc va so khop voi co so du lieu lo hong quoc gia (National Vulnerability Database - NVD) cua NIST de danh gia diem so muc do nghiem trong CVSS (Common Vulnerability Scoring System).

### So do Quy trinh Scan & Fail-Fast (Mermaid)

```mermaid
flowchart TD
    subgraph Input_Source["Nguon Phu thuoc Ma nguon"]
        LOCKFILE["package-lock.json / yarn.lock / pom.xml"]
        SRC_DEP["Thu muc node_modules / vendor"]
    end

    subgraph Dependency_Engine["Dong co OWASP Dependency-Check"]
        LOCAL_CACHE["Co so du lieu Local NVD H2/Postgres"]
        NIST_API["NVD NIST API Endpoint"]
        SCANNER["Phan tich CPE & So khop CVE"]
        SUPPRESSION["Bo loc False Positive (suppressions.xml)"]
    end

    subgraph Decision_Gate["Ngau hung Danh gia & Kiem soat Gate"]
        CVSS_EVAL{"Kiem tra Diem CVSS >= Nguong (FailOnCVSS: 7.0)?"}
        FAIL_BLOCK["[FAIL] Dung Pipeline & Chan Merge PR"]
        PASS_ALLOW["[PASS] Tao Bao cao & Cho phep Buoc tiep theo"]
    end

    LOCKFILE --> SCANNER
    SRC_DEP --> SCANNER
    NIST_API -->|Sync NVD Feeds| LOCAL_CACHE
    LOCAL_CACHE --> SCANNER
    SCANNER --> SUPPRESSION
    SUPPRESSION --> CVSS_EVAL
    
    CVSS_EVAL -->|Diem CVSS >= 7.0 (High/Critical)| FAIL_BLOCK
    CVSS_EVAL -->|Diem CVSS < 7.0| PASS_ALLOW
```

### So do Luong Kiem soat CVSS Score (ASCII Diagram)

```
+-----------------------------------------------------------------------+
|                    OWASP DEPENDENCY-CHECK SCAN PIPELINE               |
|                                                                       |
|   +--------------------------+                                        |
|   |  Dependency Lockfiles    |                                        |
|   |  - package-lock.json     |                                        |
|   +--------------------------+                                        |
|                |                                                      |
|                v                                                      |
|   +--------------------------+          +-------------------------+   |
|   |  OWASP Dependency-Check  | <======> | NVD NIST Database Cache |   |
|   |  Analyzer & CPE Matcher  |          | (CVSS v2, v3, v3.1 Data)|   |
|   +--------------------------+          +-------------------------+   |
|                |                                                      |
|                v                                                      |
|   +--------------------------+          +-------------------------+   |
|   |  Suppression Filter      | <------- |  suppressions.xml       |   |
|   |  (Filter verified false) |          |  (Exceptions whitelist) |   |
|   +--------------------------+          +-------------------------+   |
|                |                                                      |
|                +--------------------+                                 |
|                                     |                                 |
|                                     v                                 |
|                      +-----------------------------+                  |
|                      |  CVSS Threshold Evaluator   |                  |
|                      |  --failOnCVSS 7.0           |                  |
|                      +-----------------------------+                  |
|                                     |                                 |
|                  +------------------+------------------+              |
|                  |                                     |              |
|                  v (CVSS >= 7.0)                       v (CVSS < 7.0) |
|      +-----------------------+             +-----------------------+  |
|      | [BUILD FAILED]        |             | [BUILD PASSED]        |  |
|      | High/Critical Alert   |             | Generate HTML/JSON    |  |
|      | Block Deployment      |             | Proceed to next stage |  |
|      +-----------------------+             +-----------------------+  |
+-----------------------------------------------------------------------+
```

---

## 2. Thang Diem CVSS va Chien luoc Thiet lap Nguong chan

Tieu chuan CVSS v3.1 phan chia do nghiem trong cua lo hong theo cac muc:

| Muc do Nghiem trong | Thang diem CVSS v3.1 | Tac dong thuc te | Hanh dong trong Pipeline |
| :--- | :--- | :--- | :--- |
| **CRITICAL** | 9.0 - 10.0 | Lo hong thuc thi ma tu xa (RCE), chiem quyen he thong | **CHAN BUILD NGAY LAP TUC** |
| **HIGH** | 7.0 - 8.9 | Lo hong ro ri du lieu nhay cam, leo thang dac quyen | **CHAN BUILD BAT BUOC** |
| **MEDIUM** | 4.0 - 6.9 | Lo hong DoS cuc bo, bypass kiem tra nhe | Tao canh bao (Warning), can fix trong Sprint |
| **LOW** | 0.1 - 3.9 | Anh huong rat thap, yeu cau dieu kien kho xay ra | Ghi nhan vao bao cao theo doi |

**Quy tac chuan cho du an**: Thiet lap tham so `--failOnCVSS 7.0`. Bat ky lo hong nao co diem CVSS >= 7.0 se lap tuc tra ve Exit Code khac 0, lam dung toan bo Pipeline.

---

## 3. Huong dan Cai dat OWASP Dependency-Check CLI va Docker

### Phuong an 1: Chay qua Docker Container (Khuyen nghi cho CI/CD)

Chay quet truc tiep ma khong can cai dat Java tren may tram:

```bash
# Tao thu muc chua cache database de tranh tai lai NVD moi lan chay
mkdir -p /opt/owasp-data

# Thuc thi quet voi Docker
docker run --rm \
  -e NVD_API_KEY="your-nvd-api-key-here" \
  -v $(pwd):/src \
  -v /opt/owasp-data:/usr/share/dependency-check/data \
  -v $(pwd)/reports/owasp:/report \
  owasp/dependency-check:latest \
  --project "Core-Workflow" \
  --scan /src \
  --exclude "**/node_modules/**" \
  --exclude "**/tests/**" \
  --format "ALL" \
  --out /report \
  --failOnCVSS 7.0
```

### Phuong an 2: Cai dat CLI tren Linux

```bash
# Tai ban phat hanh chinh thuc
VERSION="9.0.9"
wget "https://github.com/jeremylong/DependencyCheck/releases/download/v${VERSION}/dependency-check-${VERSION}-release.zip"
unzip dependency-check-${VERSION}-release.zip -d /opt/
ln -s /opt/dependency-check/bin/dependency-check.sh /usr/local/bin/dependency-check

# Kiem tra phien ban
dependency-check --version
```

---

## 4. Dang ky va Cau hinh NVD API Key

Tu thang 11/2023, NVD (NIST) gioi han toc do truy cap khong co API Key (Rate Limit rat gat), de dan den loi timeout khi tai co so du lieu lo hong.

1. Truy cap: `https://nvd.nist.gov/developers/request-an-api-key` de dang ky API Key mien phi.
2. Nhan Key qua email (dang chuoi UUID: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`).
3. Khai bao bien moi truong:
   ```bash
   export NVD_API_KEY="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
   ```

Khi chay lenh `dependency-check`, them tham so:
```bash
dependency-check --nvdApiKey "${NVD_API_KEY}" --scan ./ --failOnCVSS 7
```

---

## 5. Cau hinh Tap tin Suppression (Loai bo False Positive)

Trong mot so truong hop, thu vien duoc canh bao lo hong nhung thu vien do chi su dung trong moi truong Dev/Test, hoac lo hong khong the khai thac trong ngu canh ung dung hien tai. De tranh chan build sai, ta su dung tap tin `suppressions.xml`.

Tao tap tin `dependency-check-suppressions.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<suppressions xmlns="https://jeremylong.github.io/DependencyCheck/dependency-suppression.1.3.xsd">
    
    <!-- Mau 1: Bo qua lo hong theo ten goi va CVE cu the da duoc danh gia an toan -->
    <suppress>
        <notes><![CDATA[
            CVE-2023-12345 chi anh huong toi chuc nang server-side rendering khong duoc su dung trong package nay.
            Da duoc Security Team phe duyet ngay 2026-08-15.
        ]]></notes>
        <packageUrl regex="true">^pkg:npm/some-legacy-lib@.*$</packageUrl>
        <cve>CVE-2023-12345</cve>
    </suppress>

    <!-- Mau 2: Bo qua tat ca lo hong co muc do duoi 5.0 trong goi dev-only -->
    <suppress>
        <notes><![CDATA[Bo qua canh bao nhe trong thu vien mock test chay cuc bo]]></notes>
        <packageUrl regex="true">^pkg:npm/@types/.*$</packageUrl>
        <cvssBelow>5.0</cvssBelow>
    </suppress>

    <!-- Mau 3: Bo qua CPE nhan dien nham (False Identification) -->
    <suppress>
        <notes><![CDATA[Thu vien local bi nhan dien nham voi Apache Commons]]></notes>
        <filePath regex="true">.*my-custom-internal-util.*\.jar</filePath>
        <cpe>cpe:/a:apache:commons_io</cpe>
    </suppress>

</suppressions>
```

Thuc thi quet kem tap tin suppression:

```bash
dependency-check \
  --scan ./ \
  --suppression ./dependency-check-suppressions.xml \
  --failOnCVSS 7.0 \
  --format HTML --format JSON \
  --out ./reports/owasp
```

---

## 6. Tich hop vao Jenkinsfile Declarative Pipeline

Bo sung Stage quet OWASP Dependency-Check vao `Jenkinsfile`:

```groovy
stage('OWASP Dependency Check') {
    environment {
        NVD_API_SECRET = credentials('nvd-nist-api-key')
    }
    steps {
        echo "[INFO] Bat dau quet lo hong phu thuoc voi OWASP Dependency-Check..."
        sh '''
            mkdir -p reports/owasp
            
            # Thuc thi quet voi nguong chan CVSS 7.0
            dependency-check \
                --project "${PROJECT_NAME}" \
                --scan ./package-lock.json \
                --scan ./ \
                --exclude "**/node_modules/**" \
                --exclude "**/.next/**" \
                --exclude "**/dist/**" \
                --suppression ./dependency-check-suppressions.xml \
                --nvdApiKey "${NVD_API_SECRET}" \
                --format "ALL" \
                --out ./reports/owasp \
                --failOnCVSS 7.0
        '''
    }
    post {
        always {
            // Xuat bao cao len giao dien Jenkins
            dependencyCheckPublisher(
                pattern: 'reports/owasp/dependency-check-report.xml',
                failedTotalHigh: '1',
                failedTotalCritical: '1',
                unstableTotalMedium: '5'
            )
            archiveArtifacts artifacts: 'reports/owasp/**', allowEmptyArchive: true
        }
        failure {
            echo "[SECURITY ALERT] Phat hien lo hong bao mat CVSS >= 7.0! Build bi dung bat buoc."
        }
    }
}
```

---

## 7. Script Kiem tra Tu dong va Xuat Ket qua JSON

Script `scripts/check-owasp-report.js` de phan tich ket qua JSON va gui canh bao tong hop:

```javascript
const fs = require('fs');
const path = require('path');

const reportPath = path.join(__dirname, '../reports/owasp/dependency-check-report.json');

if (!fs.existsSync(reportPath)) {
  console.error('[ERROR] Khong tim thay tap tin bao cao OWASP:', reportPath);
  process.exit(1);
}

const rawData = fs.readFileSync(reportPath, 'utf8');
const report = JSON.parse(rawData);

let criticalCount = 0;
let highCount = 0;
let mediumCount = 0;
const criticalVulnerabilities = [];

if (report.dependencies) {
  report.dependencies.forEach((dep) => {
    if (dep.vulnerabilities) {
      dep.vulnerabilities.forEach((vuln) => {
        const cvssScore = vuln.cvssv3 ? vuln.cvssv3.baseScore : (vuln.cvssv2 ? vuln.cvssv2.score : 0);
        const severity = vuln.severity ? vuln.severity.toUpperCase() : 'UNKNOWN';

        if (severity === 'CRITICAL' || cvssScore >= 9.0) {
          criticalCount++;
          criticalVulnerabilities.push({ name: dep.fileName, cve: vuln.name, score: cvssScore, desc: vuln.description });
        } else if (severity === 'HIGH' || cvssScore >= 7.0) {
          highCount++;
          criticalVulnerabilities.push({ name: dep.fileName, cve: vuln.name, score: cvssScore, desc: vuln.description });
        } else if (severity === 'MEDIUM' || cvssScore >= 4.0) {
          mediumCount++;
        }
      });
    }
  });
}

console.log('====================================================');
console.log('       OWASP DEPENDENCY-CHECK SCAN SUMMARY          ');
console.log('====================================================');
console.log(`CRITICAL Vulnerabilities (CVSS >= 9.0): ${criticalCount}`);
console.log(`HIGH Vulnerabilities     (CVSS >= 7.0): ${highCount}`);
console.log(`MEDIUM Vulnerabilities   (CVSS >= 4.0): ${mediumCount}`);
console.log('----------------------------------------------------');

if (criticalVulnerabilities.length > 0) {
  console.error('[FAIL-FAST] Danh sach lo hong can xu ly ngay:');
  criticalVulnerabilities.forEach((v) => {
    console.error(`- [${v.cve}] (CVSS: ${v.score}) Package: ${v.name}`);
  });
  process.exit(1);
} else {
  console.log('[PASS] Tat ca phu thuoc deu nam trong nguong an toan.');
  process.exit(0);
}
```

---

## 8. Xu ly Su co Thuong gap (Troubleshooting)

### Su co 1: `DownloadException: Error downloading NVD CVE data`
- **Nguyen nhan**: NVD API bi Rate Limit hoac mat ket noi mang Internet.
- **Khac phuc**: 
  - Kiem tra lai API Key da duoc truyen qua tham so `--nvdApiKey`.
  - Tang thoi gian delay giua cac request: `--nvdApiDelay 10000`.
  - Su dung local mirror cache NVD data.

### Su co 2: Quet qua lau (Scan time > 15 phut)
- **Nguyen nhan**: Quet toan bo thu muc `node_modules` chua hang chuc nghin file nho.
- **Khac phuc**: Khong quet truc tiep `node_modules`, chi quet tap tin khai bao goi khoa: `--scan package-lock.json` va them `--exclude "**/node_modules/**"`.

---
*Tai lieu duoc bien soan boi Docs & Knowledge Author Squad.*
