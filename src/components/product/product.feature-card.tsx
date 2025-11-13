import * as Icons from 'react-icons/fa6';

export function FeatureCard_Component({ feature }: { 
    feature: { 
        title: string; 
        icon: string;
        description: string;
    } 
}) {
    return (
        <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white">
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-700">{feature.description}</p>
        </div>
    );
}