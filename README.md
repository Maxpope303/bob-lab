# Bob Lab - Java Modernization Workspace

[![Java CI](https://github.com/Maxpope303/bob-lab/actions/workflows/java-ci.yml/badge.svg)](https://github.com/Maxpope303/bob-lab/actions/workflows/java-ci.yml)
[![Node React CI](https://github.com/Maxpope303/bob-lab/actions/workflows/node-ci.yml/badge.svg)](https://github.com/Maxpope303/bob-lab/actions/workflows/node-ci.yml)
[![Python Flask CI](https://github.com/Maxpope303/bob-lab/actions/workflows/python-ci.yml/badge.svg)](https://github.com/Maxpope303/bob-lab/actions/workflows/python-ci.yml)
[![Terraform Pipeline](https://github.com/Maxpope303/bob-lab/actions/workflows/terraform-plan.yml/badge.svg)](https://github.com/Maxpope303/bob-lab/actions/workflows/terraform-plan.yml)
[![Helm Chart Pipeline](https://github.com/Maxpope303/bob-lab/actions/workflows/helm-lint.yml/badge.svg)](https://github.com/Maxpope303/bob-lab/actions/workflows/helm-lint.yml)
[![Ansible Pipeline](https://github.com/Maxpope303/bob-lab/actions/workflows/ansible-ci.yml/badge.svg)](https://github.com/Maxpope303/bob-lab/actions/workflows/ansible-ci.yml)
[![Release](https://github.com/Maxpope303/bob-lab/actions/workflows/release.yml/badge.svg)](https://github.com/Maxpope303/bob-lab/actions/workflows/release.yml)
[![codecov](https://codecov.io/gh/Maxpope303/bob-lab/branch/main/graph/badge.svg)](https://codecov.io/gh/Maxpope303/bob-lab)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)

> **Note**: Replace `Maxpope303/bob-lab` in the badge URLs with your actual GitHub repository path.

A polyglot workspace for Java application modernization and migration projects.
The core subject is a legacy Java EE pharmacy application; the surrounding modules
demonstrate a full modernization ecosystem across multiple languages and infrastructure tools.

---

## Repository Structure

```
bob-lab/
│
├── simple-pharmacy-twas-j8-struts-V2/   # Java 8 / Struts 2 / tWAS application (legacy)
│   ├── src/                             # Application source code
│   ├── pom.xml                          # Maven build
│   └── ama/                             # IBM AMA assessment artifacts
│
├── pipelines/                           # Non-Java pipeline modules
│   ├── node-react/                      # React 18 dashboard UI (TypeScript + Vite)
│   ├── python-flask/                    # Python analytics microservice (Flask)
│   ├── terraform/                       # AWS infrastructure (ECS + VPC + ALB)
│   ├── helm/                            # Kubernetes Helm chart (all three services)
│   └── ansible/                         # Configuration management (tWAS + Liberty)
│
├── .github/
│   ├── workflows/
│   │   ├── java-ci.yml                  # Triggered on: simple-pharmacy-twas-j8-struts-V2/**
│   │   ├── node-ci.yml                  # Triggered on: pipelines/node-react/**
│   │   ├── python-ci.yml                # Triggered on: pipelines/python-flask/**
│   │   ├── terraform-plan.yml           # Triggered on: pipelines/terraform/**
│   │   ├── helm-lint.yml                # Triggered on: pipelines/helm/**
│   │   ├── ansible-ci.yml               # Triggered on: pipelines/ansible/**
│   │   ├── release.yml                  # Triggered on: version tags (v*.*.*)
│   │   └── jira-integration.yml         # Triggered on: all pipelines
│   └── PULL_REQUEST_TEMPLATE.md
│
├── application-modernization-accelerator-local-4.5.2/   # IBM AMA local tool
├── pom.xml                              # Parent Maven POM (Java modules only)
└── README.md
```

---

## Modules

### Java — Simple Pharmacy (`simple-pharmacy-twas-j8-struts-V2/`)

A pharmacy management system built with Java 8, Apache Struts 2.5, and WebSphere
Traditional. Used as the subject of an IBM AMA modernization assessment demonstrating
migration to Java 17 + OpenLiberty.

**Stack**: Java 8 → 17 · Apache Struts 2.5 · WebSphere tWAS → Liberty · Maven · WAR

**Pipeline**: Build → Test (JUnit 5, JaCoCo ≥30%) → SpotBugs → OWASP Dep-Check → Podman container → Approval gate

```bash
cd simple-pharmacy-twas-j8-struts-V2
mvn clean package
./build-and-run.sh
```

---

### Node React (`pipelines/node-react/`)

React 18 dashboard UI consuming the pharmacy backend REST API. Demonstrates a
modernized frontend sitting alongside the migrated Java backend.

**Stack**: React 18 · TypeScript · Vite · Vitest · ESLint · Node 20

**Pipeline**: TypeCheck → ESLint → Vitest (coverage) → npm audit → Vite build → Container

```bash
cd pipelines/node-react
npm ci
npm run dev         # Development server on :3000 (proxies /api to :9080)
npm test            # Run Vitest unit tests
npm run build       # Production build to dist/
```

---

### Python Flask (`pipelines/python-flask/`)

Analytics microservice providing inventory reports, prescription breakdowns, and
revenue summaries by calling the Java backend and aggregating data in Python.

**Endpoints**:
- `GET /health` — Health check
- `GET /api/v1/analytics/medicines/summary` — Stock totals and low-stock alerts
- `GET /api/v1/analytics/prescriptions/summary` — Status breakdown
- `GET /api/v1/analytics/prescriptions/top-medicines` — Top prescribed medicines
- `GET /api/v1/analytics/orders/summary` — Revenue by payment method

**Stack**: Python 3.12 · Flask 3 · gunicorn · pytest · bandit · safety · flake8

**Pipeline**: flake8 → bandit/safety → pytest (coverage ≥30%) → Container

```bash
cd pipelines/python-flask
pip install -r requirements.txt -r requirements-dev.txt
python run.py                  # Dev server on :5000
pytest                         # Run all tests with coverage
```

---

### Terraform (`pipelines/terraform/`)

AWS infrastructure for running the pharmacy demo stack: VPC, subnets, ALB,
security groups, and ECS Fargate cluster. Separate `tfvars` files per environment.

**Stack**: Terraform ≥1.7 · AWS provider ~5.40 · S3 remote state · ECS Fargate

**Pipeline**: `terraform fmt` → `terraform validate` → tfsec → checkov → `terraform plan` (PR) → `terraform apply` (main, gated)

```bash
cd pipelines/terraform
terraform init -backend-config=environments/dev/backend.tfvars
terraform plan  -var-file=environments/dev/terraform.tfvars
terraform apply -var-file=environments/dev/terraform.tfvars
```

---

### Helm (`pipelines/helm/`)

Kubernetes Helm chart that deploys all three application services (Java backend,
React UI, Python analytics) as a single release with a shared ingress.

**Stack**: Helm 3 · Kubernetes 1.28+ · nginx ingress

**Pipeline**: `helm lint` → `helm template` → kubeval → Polaris audit → `helm upgrade` (main, gated)

```bash
cd pipelines/helm
helm lint simple-pharmacy
helm install pharmacy-dev ./simple-pharmacy --namespace pharmacy-dev --create-namespace
helm upgrade  pharmacy-dev ./simple-pharmacy --set javaBackend.image.tag=<sha>
```

---

### Ansible (`pipelines/ansible/`)

Configuration management playbooks for both the legacy tWAS baseline and the
modernized Liberty target. Includes OS hardening, service provisioning, and WAR
deployment roles.

**Playbooks**:
- `site.yml` — Full environment setup
- `playbooks/provision-twas.yml` — tWAS server provisioning
- `playbooks/deploy-liberty.yml` — WAR deployment to Liberty
- `playbooks/harden-os.yml` — OS hardening (firewall, SSH)

**Roles**: `was-baseline` · `liberty-runtime` · (via `harden-os` playbook)

**Pipeline**: yamllint → ansible-lint → syntax-check → Molecule role tests → Deploy (manual approval)

```bash
cd pipelines/ansible
ansible-playbook site.yml -i inventories/dev/hosts.ini --check   # Dry run
ansible-playbook playbooks/deploy-liberty.yml -i inventories/dev/hosts.ini
```

---

## CI/CD — How Pipelines Are Isolated

Each workflow uses GitHub Actions `paths` filters so it only triggers when its
own module changes. Pushing to `pipelines/node-react/` fires the Node pipeline;
pushing to `simple-pharmacy-twas-j8-struts-V2/` fires the Java pipeline. No overlap.

| Workflow | Trigger path | Key checks |
|---|---|---|
| `java-ci.yml` | `simple-pharmacy-twas-j8-struts-V2/**` | Maven · JUnit · JaCoCo · SpotBugs · OWASP |
| `node-ci.yml` | `pipelines/node-react/**` | tsc · ESLint · Vitest · npm audit |
| `python-ci.yml` | `pipelines/python-flask/**` | flake8 · bandit · safety · pytest |
| `terraform-plan.yml` | `pipelines/terraform/**` | fmt · validate · tfsec · checkov · plan/apply |
| `helm-lint.yml` | `pipelines/helm/**` | helm lint · kubeval · Polaris · helm upgrade |
| `ansible-ci.yml` | `pipelines/ansible/**` | yamllint · ansible-lint · syntax-check · Molecule |
| `release.yml` | `v*.*.*` tags | Full Java build + GHCR push + SBOM |
| `jira-integration.yml` | All branches | Jira ticket transitions + build comments |

---

## Prerequisites

| Tool | Version | Used by |
|---|---|---|
| Java JDK | 8 or 17 (IBM Semeru) | Java module |
| Maven | 3.6+ | Java module |
| Node.js | 20 LTS | Node module |
| Python | 3.12 | Python module |
| Terraform | ≥1.7 | Terraform module |
| Helm | ≥3.14 | Helm module |
| Ansible | ≥2.15 | Ansible module |
| Podman or Docker | Latest | All containers |

---

## GitHub Secrets Required

| Secret | Used by |
|---|---|
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | Terraform |
| `DEV_KUBECONFIG` | Helm deploy |
| `DEV_SSH_PRIVATE_KEY` | Ansible deploy |
| `JIRA_BASE_URL` / `JIRA_USER_EMAIL` / `JIRA_API_TOKEN` / `JIRA_PROJECT_KEY` | Jira integration |

---

## Resources

- [IBM Application Modernization Accelerator](https://www.ibm.com/docs/en/app-modernization-accelerator)
- [Apache Struts 2 Documentation](https://struts.apache.org/core-developers/)
- [OpenLiberty Documentation](https://openliberty.io/docs/)
- [Vite Documentation](https://vitejs.dev/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Helm Documentation](https://helm.sh/docs/)
- [Ansible Documentation](https://docs.ansible.com/)

---

**Made with Bob** — Your AI-powered Java modernization assistant
