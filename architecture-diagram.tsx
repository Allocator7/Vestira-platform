"use client"
import { Rectangle, Database, Cloud, Server, MobileDevice, Desktop, Lock, Shield } from "./diagram-components"

export default function ArchitectureDiagram() {
  return (
    <div className="w-full h-full min-h-[800px] bg-white p-4 overflow-auto">
      <svg width="1200" height="800" viewBox="0 0 1200 800">
        {/* Title */}
        <text x="600" y="40" textAnchor="middle" className="text-2xl font-bold">
          Vestira 3.0 Architecture
        </text>

        {/* Client Layer */}
        <g transform="translate(0, 80)">
          <Rectangle x={50} y={0} width={1100} height={120} label="Client Layer" color="#e3f2fd" />
          <MobileDevice x={150} y={60} label="Mobile App" />
          <Desktop x={350} y={60} label="Web Application" />
          <Rectangle x={550} y={30} width={180} height={80} label="React Components" color="#bbdefb" />
          <Rectangle x={800} y={30} width={180} height={80} label="State Management" color="#bbdefb" />
        </g>

        {/* API Gateway Layer */}
        <g transform="translate(0, 220)">
          <Rectangle x={50} y={0} width={1100} height={80} label="API Gateway" color="#c8e6c9" />
          <Shield x={200} y={40} label="Authentication" />
          <Shield x={400} y={40} label="Authorization" />
          <Shield x={600} y={40} label="Rate Limiting" />
          <Shield x={800} y={40} label="Request Validation" />
          <Shield x={1000} y={40} label="Logging" />
        </g>

        {/* Service Layer */}
        <g transform="translate(0, 320)">
          <Rectangle x={50} y={0} width={1100} height={200} label="Service Layer" color="#ffecb3" />

          <Rectangle x={100} y={40} width={160} height={70} label="Auth Service" color="#ffe082" />
          <Rectangle x={280} y={40} width={160} height={70} label="Document Service" color="#ffe082" />
          <Rectangle x={460} y={40} width={160} height={70} label="DDQ Service" color="#ffe082" />
          <Rectangle x={640} y={40} width={160} height={70} label="Analytics Service" color="#ffe082" />
          <Rectangle x={820} y={40} width={160} height={70} label="Messaging Service" color="#ffe082" />
          <Rectangle x={1000} y={40} width={120} height={70} label="Admin Service" color="#ffe082" />

          <Rectangle x={100} y={120} width={160} height={70} label="User Service" color="#ffe082" />
          <Rectangle x={280} y={120} width={160} height={70} label="Data Room Service" color="#ffe082" />
          <Rectangle x={460} y={120} width={160} height={70} label="Notification Service" color="#ffe082" />
          <Rectangle x={640} y={120} width={160} height={70} label="Search Service" color="#ffe082" />
          <Rectangle x={820} y={120} width={160} height={70} label="Integration Service" color="#ffe082" />
          <Rectangle x={1000} y={120} width={120} height={70} label="Compliance Service" color="#ffe082" />
        </g>

        {/* Data Layer */}
        <g transform="translate(0, 540)">
          <Rectangle x={50} y={0} width={1100} height={120} label="Data Layer" color="#e1bee7" />

          <Database x={150} y={60} label="PostgreSQL" />
          <Database x={350} y={60} label="Redis Cache" />
          <Database x={550} y={60} label="Elasticsearch" />
          <Database x={750} y={60} label="S3 Document Storage" />
          <Database x={950} y={60} label="Analytics Data Warehouse" />
        </g>

        {/* Infrastructure Layer */}
        <g transform="translate(0, 680)">
          <Rectangle x={50} y={0} width={1100} height={100} label="Infrastructure" color="#d1c4e9" />

          <Cloud x={200} y={50} label="AWS/Azure Cloud" />
          <Server x={400} y={50} label="Kubernetes" />
          <Server x={600} y={50} label="CI/CD Pipeline" />
          <Lock x={800} y={50} label="Security & Compliance" />
          <Rectangle x={950} y={30} width={150} height={40} label="Monitoring & Logging" color="#b39ddb" />
        </g>

        {/* Connecting Lines */}
        <g stroke="#666" strokeWidth="1" strokeDasharray="5,5">
          <line x1="600" y1="200" x2="600" y2="220" />
          <line x1="600" y1="300" x2="600" y2="320" />
          <line x1="600" y1="520" x2="600" y2="540" />
          <line x1="600" y1="660" x2="600" y2="680" />
        </g>
      </svg>
    </div>
  )
}
