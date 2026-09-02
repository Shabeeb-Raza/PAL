declare module "clsx" {
  export function clsx(...args: any[]): string;
  export default clsx;
}

declare module "tailwind-merge" {
  export function twMerge(...args: string[]): string;
}

declare module "class-variance-authority" {
  export function cva(base: string, config?: any): any;
}

declare module "lucide-react" {
  export const LayoutDashboard: React.FC<{ className?: string }>;
  export const Users: React.FC<{ className?: string }>;
  export const AlertTriangle: React.FC<{ className?: string }>;
  export const Settings: React.FC<{ className?: string }>;
  export const Search: React.FC<{ className?: string }>;
  export const ArrowLeft: React.FC<{ className?: string }>;
  export const CheckCircle: React.FC<{ className?: string }>;
  export const XCircle: React.FC<{ className?: string }>;
  export const TrendingUp: React.FC<{ className?: string }>;
  export const GraduationCap: React.FC<{ className?: string }>;
}
