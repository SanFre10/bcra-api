import ValueCard from '@/components/ValueCard';
import { LineChart } from '@tremor/react';

interface Data {
	results: [{ fecha: string; valor: number }];
}

async function getData(idVariable: number): Promise<Data> {
	process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
	const res = await fetch(`https://api.bcra.gob.ar/estadisticas/v1/DatosVariable/${idVariable}/2024-04-05/2024-05-05`);

	if (!res.ok) {
		// This will activate the closest `error.js` Error Boundary
		throw new Error('Failed to fetch data');
	}

	return res.json();
}

export default async function Page({ params: { idVariable } }: { params: { idVariable: number } }) {
	const data = (await getData(idVariable)).results;

	return (
		<>
			<ValueCard key={idVariable} idVariable={idVariable} fecha={data.at(-1)!.fecha} valor={data.at(-1)!.valor} />
			<LineChart data={data} index="fecha" categories={['valor']} autoMinValue={true} />
		</>
	);
}
