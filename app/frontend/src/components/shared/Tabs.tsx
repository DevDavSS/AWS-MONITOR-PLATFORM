interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Tabs({
  tabs,
  activeTab,
  onTabChange,
}: TabsProps) {
  return (
  <div className="border-b">
    <nav className="flex gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-6 py-3 text-base font-medium rounded-t-lg border-b-2 transition-all ${
            activeTab === tab.id
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  </div>
  );
}