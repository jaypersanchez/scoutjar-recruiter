import { Tabs, TabsList, TabsTrigger } from "@/common/components/ui";

const RoleTypes = [
  { id: 0, slug: "talent", label: "Talent" },
  { id: 1, slug: "talent-scout", label: "Talent Scout" },
];

export default function Roles({ onRoleChange }) {
  return (
    <Tabs defaultValue="talent" className="w-full" onValueChange={onRoleChange}>
      <TabsList className="w-full h-11 border border-gray-300 text-gray-400">
        {RoleTypes.map((data) => (
          <TabsTrigger
            key={data.id}
            value={data.slug}
            className="uppercase font-medium h-9 data-[state=active]:bg-gray-950 data-[state=active]:text-gray-50 cursor-pointer"
          >
            <p className="text-xs font-bold tracking-wider uppercase">
              {data.label}
            </p>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
