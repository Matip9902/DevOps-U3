# Innovatech SPA - DevOps EP3

Aplicacion de ventas y despachos desplegada en **Amazon EKS**. El repositorio incluye infraestructura como codigo, contenedores, persistencia, autoscaling y CI/CD desde GitHub Actions hacia Amazon ECR y EKS.

## Arquitectura

```text
Internet
   |
AWS LoadBalancer
   |
Frontend React + Nginx (2-4 pods, HPA 60% CPU)
   |-- /api/ventas ----> backend-ventas (2-5 pods, HPA 50% CPU) ----> MySQL ventas + PVC
   |-- /api/despachos -> backend-despacho (2-5 pods, HPA 50% CPU) --> MySQL despacho + PVC

GitHub Actions -> pruebas -> Docker build -> Amazon ECR -> kubectl apply -> Amazon EKS
```

La VPC usa dos subredes publicas en zonas de disponibilidad distintas. EKS administra los nodos y Kubernetes recupera los pods mediante Deployments, health checks y replicas. El LoadBalancer solo expone el frontend; backends y bases de datos usan servicios internos `ClusterIP`.

## Componentes

| Componente | Tecnologia |
|---|---|
| Frontend | React, Vite y Nginx |
| Backend | Spring Boot 3 y Java 17 |
| Base de datos | MySQL 8 con almacenamiento temporal para AWS Academy |
| Orquestacion | Amazon EKS |
| Registro | Amazon ECR, tres repositorios |
| Infraestructura | Terraform |
| Automatizacion | GitHub Actions |

## Requisitos

- AWS Academy Learner Lab activo y `LabRole` disponible.
- AWS CLI, Terraform, Docker y kubectl.
- Credenciales temporales del laboratorio configuradas.

## 1. Crear infraestructura

```bash
cd infra
terraform init
terraform fmt -check
terraform validate
terraform plan -out=tfplan
terraform apply tfplan
aws eks update-kubeconfig --region us-east-1 --name innovatech-spa
kubectl get nodes
```

Terraform crea VPC, Internet Gateway, dos subredes, tabla de rutas, Security Group, clúster EKS, node group y repositorios ECR para frontend, ventas y despacho.

MySQL usa `emptyDir` para evitar el complemento EBS CSI, cuyos permisos normalmente no están disponibles en AWS Academy. Si un pod de MySQL se recrea, los datos temporales se pierden y los backends vuelven a cargar automáticamente los datos de demostración. Para producción se recomienda Amazon RDS.

> AWS Academy renueva sus credenciales en cada laboratorio. Actualiza los GitHub Secrets antes de ejecutar el pipeline.

## 2. Secrets de GitHub

Configurar en `Settings > Secrets and variables > Actions`:

| Secret | Uso |
|---|---|
| `AWS_ACCESS_KEY_ID` | Credencial temporal AWS |
| `AWS_SECRET_ACCESS_KEY` | Credencial temporal AWS |
| `AWS_SESSION_TOKEN` | Token temporal de AWS Academy |
| `MYSQL_ROOT_PASSWORD` | Clave creada como Kubernetes Secret |

No se deben guardar credenciales reales en `.env`, YAML, Terraform ni en el historial Git.

## 3. Pipeline CI/CD

El flujo [ci.yml](.github/workflows/ci.yml):

1. Ejecuta pruebas Maven de ambos backends.
2. Compila el frontend.
3. Construye tres imagenes Docker.
4. Publica cada imagen en ECR con las etiquetas `latest` y SHA del commit.

Después de un CI exitoso en `main`, [cd.yml](.github/workflows/cd.yml):

1. Conecta `kubectl` al clúster EKS.
2. Instala Metrics Server para HPA.
3. Genera el Secret de MySQL desde GitHub Secrets.
4. Sustituye ECR y SHA en los manifiestos.
5. Aplica los recursos y espera los rollouts.
6. Muestra pods, servicios, HPA y URL pública.

`develop` construye y publica imágenes; `main` además despliega a EKS.

## Autoscaling

Los backends escalan entre 2 y 5 replicas al superar un promedio de **50% de CPU**. El frontend escala entre 2 y 4 al superar **60%**. Los umbrales permiten reaccionar antes de saturar un pod y conservan capacidad para absorber aumentos de tráfico.

```bash
kubectl -n innovatech get hpa -w
kubectl -n innovatech top pods
bash scripts/load-test.sh http://URL_DEL_LOAD_BALANCER 1000
```

## Validacion y evidencias

```bash
kubectl -n innovatech get pods,svc,hpa,pvc
kubectl -n innovatech logs deployment/backend-ventas --tail=100
kubectl -n innovatech logs deployment/backend-despacho --tail=100
kubectl -n innovatech rollout status deployment/frontend
curl http://URL_DEL_LOAD_BALANCER/health
curl http://URL_DEL_LOAD_BALANCER/api/ventas
curl http://URL_DEL_LOAD_BALANCER/api/despachos
```

Para demostrar autorecuperacion:

```bash
kubectl -n innovatech delete pod -l app=backend-ventas
kubectl -n innovatech get pods -w
```

Registrar en [docs/evidencias.md](docs/evidencias.md) capturas, duración del pipeline, errores encontrados, métricas antes/durante la carga y recuperación del pod.

## Ejecucion local

```bash
cp .env.example .env
docker compose up --build
```

Frontend: `http://localhost:8080`; ventas: `http://localhost:9091`; despachos: `http://localhost:9090`.

### Datos iniciales

Cuando una base de datos está vacía, cada backend crea automáticamente datos de demostración:

- Seis ventas con órdenes pendientes y órdenes que ya poseen despacho.
- Tres despachos en estados pendiente y entregado.
- La carga se ejecuta una sola vez, porque antes de insertar se comprueba que la tabla esté vacía.

Esto permite validar inmediatamente las tablas del frontend y los endpoints `/api/ventas` y `/api/despachos`. Para reiniciar los datos locales desde cero se deben eliminar los volúmenes de Docker y volver a levantar los servicios.

## Limpieza

Para evitar consumo del crédito de AWS Academy:

```bash
cd infra
terraform destroy
```

## Decisiones y problemas resueltos

- Se unificó la arquitectura en EKS; antes Terraform usaba EKS y el CD intentaba desplegar en ECS.
- Se reemplazaron IP privadas fijas por DNS de servicios Kubernetes.
- Se separaron imágenes y servicios de Ventas y Despacho.
- Se retiraron contraseñas de los manifiestos y se usan GitHub/Kubernetes Secrets.
- Se añadieron probes, recursos, persistencia, HPA y verificación automática del rollout.
