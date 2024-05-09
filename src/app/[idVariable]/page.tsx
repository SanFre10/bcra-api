import ValueCard from '@/components/ValueCard';
import { LineChart } from '@tremor/react';

interface VariableDto {
	results: [{ idVariable: number; fecha: string; valor: string }];
}

interface DataItem {
	idVariable: number;
	fecha: string;
	valor: number;
}

async function getData(idVariable: number): Promise<DataItem[]> {
	process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
	const res = await fetch(`https://api.bcra.gob.ar/estadisticas/v1/DatosVariable/${idVariable}/2024-04-05/2024-05-05`);

	const data = (await res.json()) as VariableDto;
	const result = data.results?.map((item) => ({
		idVariable: item.idVariable,
		fecha: item.fecha,
		valor: parseFloat(item.valor.replaceAll(',', '.')),
	}));
	return result;
}

export default async function Page({ params: { idVariable } }: { params: { idVariable: number } }) {
	const data = await getData(idVariable);

	return (
		<>
			<ValueCard key={idVariable} idVariable={idVariable} fecha={data.at(-1)!.fecha} valor={data.at(-1)!.valor} />
			<LineChart data={data} index="fecha" categories={['valor']} autoMinValue={true} />
		</>
	);
}
