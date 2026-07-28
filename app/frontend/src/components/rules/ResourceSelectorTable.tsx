import type { RuleSelectableResource } from "@/types/RuleSelectableResource";

interface ResourceSelectorTableProps {

    resources: RuleSelectableResource[];

    fixedResourceId?: string;

    selectedIds: string[];

    onChange: (ids: string[]) => void;

}

export function ResourceSelectorTable({

    resources,

    fixedResourceId,

    selectedIds,

    onChange

}: ResourceSelectorTableProps) {

    const toggleResource = (id: string) => {

        if (
            fixedResourceId &&
            id !== fixedResourceId
        ) {
            return;
        }

        if (selectedIds.includes(id)) {

            onChange(
                selectedIds.filter(resourceId => resourceId !== id)
            );

            return;
        }

        onChange([
            ...selectedIds,
            id
        ]);

    };

    const allSelected =

        resources.length > 0 &&

        selectedIds.length === resources.length;


    const toggleAll = () => {

        if (allSelected) {

            onChange([]);

            return;

        }

        onChange(

            resources.map(resource => resource.id)

        );

    };

    return (

    <div className="
        rounded-lg
        border
        border-gray-200
        overflow-hidden
    ">

        <div className="
            max-h-[400px]
            overflow-y-auto
        ">

            <table className="w-full text-sm">

                <thead className="
                sticky
                top-0
                z-10
                bg-gray-50
                border-b
                border-gray-200
                ">

                    <tr>

                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                        <input

                            type="checkbox"

                            checked={allSelected}

                            onChange={toggleAll}

                            disabled={fixedResourceId !== undefined}

                        />

                        </th>

                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                            Name
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                            Resource ID
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                            Account
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                            Region
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {resources.map(resource => (

                        <tr

                            key={resource.id}

                            className="
                                border-b
                                border-gray-100
                                hover:bg-gray-50
                            "

                        >

                            <td className="px-4 py-3">

                            <input

                                type="checkbox"

                                checked={selectedIds.includes(resource.id)}

                                disabled={
                                    fixedResourceId !== undefined &&
                                    resource.id !== fixedResourceId
                                }

                                onChange={() => toggleResource(resource.id)}

                            />

                            </td>

                            <td className="px-4 py-3 font-medium text-gray-900">
                                {resource.name}
                            </td>

                            <td className="px-4 py-3 text-gray-600">
                                {resource.id}
                            </td>

                            <td className="px-4 py-3 text-gray-600">
                                {resource.accountName}
                            </td>

                            <td className="px-4 py-3 text-gray-600">
                                {resource.region}
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    </div>
    );

}