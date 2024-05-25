'use client';

import ValueCard from '@/components/ValueCard';
import { BarChart, LineChart } from '@tremor/react';
import { use, useEffect, useState } from 'react';

interface VariableDto {
	results: [{ idVariable: number; fecha: string; valor: string }];
}

interface DataItem {
	idVariable: number;
	fecha: string;
	valor: number;
}

const timePeriods = {
	LASTWEEK: 1,
	LASTMONTH: 2,
	LASTQUARTER: 3,
	LASTYEAR: 4,
	CUSTOM: 5,
};

function fromToDates(timePeriod: number) {
	const from = new Date();
	const to = new Date();
	if (timePeriod === timePeriods.LASTWEEK) from.setDate(from.getDate() - 7);
	else if (timePeriod === timePeriods.LASTMONTH) from.setMonth(from.getMonth() - 1);
	else if (timePeriod === timePeriods.LASTQUARTER) from.setMonth(from.getMonth() - 3);
	else if (timePeriod === timePeriods.LASTYEAR) from.setFullYear(from.getFullYear() - 1);

	// BCRA API expects dates in format YYYY-MM-DD
	return [from.toISOString().split('T')[0], to.toISOString().split('T')[0]];
}

export default function Page({ params: { idVariable } }: { params: { idVariable: number } }) {
	const [timePeriod, setTimePeriod] = useState(timePeriods.LASTYEAR);
	const [data, setData] = useState<DataItem[] | null>(null);

	function handleChangeTimePeriod(event: React.ChangeEvent<HTMLSelectElement>) {
		setTimePeriod(parseInt(event.target.value));
	}

	async function getData() {
		process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
		const [from, to] = fromToDates(timePeriod);
		const res = await fetch(`https://api.bcra.gob.ar/estadisticas/v1/DatosVariable/${idVariable}/${from}/${to}`);

		const json = (await res.json()) as VariableDto;
		const result = json.results?.map((item) => ({
			idVariable: item.idVariable,
			fecha: item.fecha,
			valor: parseFloat(item.valor.replaceAll(',', '.')),
		}));

		setData(result);
	}

	useEffect(() => {
		getData();
	}, [timePeriod]);

	return (
		<main className="m-20 relative">
			<select defaultValue={timePeriods.LASTYEAR} onChange={handleChangeTimePeriod} className="absolute right-0 top-0">
				<option value={timePeriods.LASTWEEK}>Last week</option>
				<option value={timePeriods.LASTMONTH}>Last month</option>
				<option value={timePeriods.LASTQUARTER}>Last quarter</option>
				<option value={timePeriods.LASTYEAR}>Last year</option>
			</select>
			{data && data.at(-1) && <ValueCard key={idVariable} idVariable={idVariable} fecha={data.at(-1)!.fecha} valor={data.at(-1)!.valor} />}
			{data && <LineChart data={data} index="fecha" categories={['valor']} autoMinValue={true} />}
			{/* {data && <BarChart data={data} index="date" categories={['valor']} yAxisWidth={45} className="mt-6 hidden h-60 sm:block" />} */}
		</main>
	);
}
