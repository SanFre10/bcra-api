import ValueCard from './ValueCard';

interface Data {
	results: [{ idVariable: number; descripcion: string; fecha: string; valor: number }];
}

async function getData(): Promise<Data> {
	process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
	const res = await fetch('https://api.bcra.gob.ar/estadisticas/v1/PrincipalesVariables');

	if (!res.ok) {
		// This will activate the closest `error.js` Error Boundary
		throw new Error('Failed to fetch data');
	}

	return res.json();
}

export default async function ValueCardList() {
	const data = await getData();

	return (
		<section className="flex flex-wrap gap-10 p-10">
			{data.results.map(({ idVariable, descripcion, fecha, valor }, i) => (
				<ValueCard key={i} idVariable={idVariable} descripcion={descripcion} fecha={fecha} valor={valor} />
			))}
		</section>
	);
}
