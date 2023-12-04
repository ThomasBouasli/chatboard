import AppFooter from "@/components/app-footer";
import AppHeader from "@/components/app-header";
import Feed from "@/components/feed";

const AppPage = () => {
  return (
    <div className="relative flex min-h-[100dvh] flex-col">
      <AppHeader className="h-16" />
      <Feed />
      <AppFooter />
    </div>
  );
};
export default AppPage;
