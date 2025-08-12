<h1 align="center">
  <img height="40px" src="/assets/logo.png" alt="Logo">
  $\color{CadetBlue}{Aplicación\ Móvil\ para}$ $\color{SeaGreen}{Flor\ \&\ Cera}$
  <img height="40px" src="/assets/logo.png" alt="Logo">
</h1>

> [!IMPORTANT]
> **Descripción del Trabajo de Integración Curricular**
>
> “Flor & Cera” es un emprendimiento dedicado a la elaboración de productos artesanales con ingredientes naturales y sostenibles,
> que busca innovar y fortalecer su presencia comercial mediante un canal digital que permita a los clientes personalizar y visualizar sus productos de forma autónoma.
> Este proyecto propone el desarrollo de una aplicación móvil para ampliar su alcance y accesibilidad, incorporando un módulo de Inteligencia Artificial
> que ofrezca recomendaciones personalizadas basadas en los gustos y estilo del cliente.

---

### 🧩 Componentes del Proyecto

```mermaid
flowchart LR
        APP@{ label: "📱 **Aplicación Móvil**<br><sub style=\"color:gray\">React Native</sub>" }
        WEB@{ label: "💻 **Sitio Web**<br><sub style=\"color:gray\">Angular</sub>" }
        API@{ label: "🔗 **API RESTful**<br><sub style=\"color:gray\">Express.js</sub>" }
        DB@{ label: "🗄️ **Base de Datos**<br><sub style=\"color:gray\">MongoDB</sub>" }
    APP -. Petición HTTPS .-> API
    WEB -. Petición HTTPS .-> API
    API -. Consultas SQL .-> DB

    APP@{ shape: lean-r}
    WEB@{ shape: lean-r}
    API@{ shape: subproc}
    DB@{ shape: cylinder}
     APP:::application
     APP:::Sky
     WEB:::frontend
     WEB:::Aqua
     WEB:::Rose
     API:::backend
     DB:::db
    classDef application fill:#E8F4FF,stroke:#90CAF9,stroke-width:2px,color:#0D47A1,shadow
    classDef frontend fill:#F3F9FF,stroke:#64B5F6,stroke-width:2px,color:#0D47A1,shadow
    classDef backend fill:#FFF4E6,stroke:#FFB74D,stroke-width:2px,color:#E65100,shadow
    classDef db fill:#E9FBEF,stroke:#81C784,stroke-width:2px,color:#1B5E20,shadow
    classDef Aqua stroke-width:1px, stroke-dasharray:none, stroke:#46EDC8, fill:#DEFFF8, color:#378E7A
    classDef Sky stroke-width:1px, stroke-dasharray:none, stroke:#374D7C, fill:#E2EBFF, color:#374D7C
    classDef Rose stroke-width:1px, stroke-dasharray:none, stroke:#FF5978, fill:#FFDFE5, color:#8E2236
    style APP stroke-width:2px,stroke-dasharray: 2
    style WEB stroke-width:2px,stroke-dasharray: 2
    style API stroke-width:2px,stroke-dasharray: 2
    style DB stroke-width:2px,stroke-dasharray: 2
    linkStyle 0 stroke:#42A5F5,stroke-width:2px,fill:none,stroke-dasharray: 5 5
    linkStyle 1 stroke:#42A5F5,stroke-width:2px,fill:none,stroke-dasharray: 5 5
    linkStyle 2 stroke:#42A5F5,stroke-width:2px,fill:none,stroke-dasharray: 5 5
```

---
