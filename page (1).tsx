import { RoleSwitch } from "@/components/role-switch";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function RoleSelectPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <RoleSwitch />
      </main>
      <Footer />
    </div>
  );
}
