import { Card } from '@tremor/react';
import Link from 'next/link';

interface ValueCardProps {
	idVariable: number;
	descripcion?: string;
	fecha: string;
	valor: number;
}

export default function ValueCard({ idVariable, descripcion, fecha, valor }: ValueCardProps) {
	return (
		<Link href={`/${idVariable}`}>
			<Card className="max-w-60 cursor-pointer hover:scale-105" decoration="top" decorationColor="indigo">
				{descripcion && <p className="text-tremor-default text-tremor-content">{descripcion}</p>}
				<p className="text-3xl text-tremor-content-stron font-semibold">{valor}3</p>
			</Card>
		</Link>
	);
}
