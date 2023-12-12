import React, { useCallback, useEffect, useState } from 'react';
import BarChart, { BarChartData } from 'features/surveys/components/ResultsComponents/BarChart/BarChart';
import TextResults from 'features/surveys/components/ResultsComponents/TextResults/TextResults';
import { MappedAnswerData } from 'types/MappedAnswerData';
import { QuestionType } from '@prisma/client';

type ResultComponentProps = {
  type: QuestionType;
  question: string;
  answers: MappedAnswerData[];
  filterUserId?: string | undefined;
};

export default function ResultComponent({
  type,
  question,
  answers,
}: ResultComponentProps) {
  const [chartData, setChartData] = useState<BarChartData[]>([]);
  const [notEmptyAnswers, setNotEmptyAnswers] = useState<MappedAnswerData[]>([]);
  const [filterUserId, setFilterUserId] = useState<string | undefined>('');
  useEffect(() => {
    console.log(answers);
    const notEmptyAnswers = answers.filter(
      (answer) =>
        answer.answer !== null &&
        answer.answer !== undefined &&
        answer.answer !== ''
    );
    setNotEmptyAnswers(notEmptyAnswers);
  }, [answers]);

  const getDataToChart = useCallback((): BarChartData[] => {
    const filteredAnswers = notEmptyAnswers.filter((answer) => {
      return !filterUserId;
    });

    const answersValues = filteredAnswers.map((answer) => answer.answer);

    const uniqueAnswers = Array.from(new Set(answersValues));

    const result: {
      [key: string]: number;
    } = {};

    uniqueAnswers.forEach((answer) => {
      if (!answer) return;
      result[answer] = 0;
    });

    answersValues.forEach((answer) => {
      if (!answer) return;
      result[answer] += 1;
    });

    return Object.keys(result)
      .map((key) => ({
        name: key,
        value: result[key],
      }))
      .sort((a, b) => b.value - a.value);
  }, [notEmptyAnswers, filterUserId]);

  useEffect(() => {
    const chartData = getDataToChart();
    setChartData(chartData);
  }, [notEmptyAnswers, getDataToChart, filterUserId]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilterUserId(value === '' ? undefined : value);
    console.log(filterUserId);
  };

  return (
    <div className="mb-2 rounded-md border bg-white/50 p-4 shadow-sm">
      {/* ... other JSX ... */}
      <select
        id="userNameFilter"
        value={filterUserId ?? ''}
        onChange={handleFilterChange}
      >
        <option value="">Vyberte meno používateľa...</option>
        <option value='Kukucka'>Kukucka</option>
        <option value='Samuel Repko'>Samuel Repko</option>
      </select>
      {/* Zobrazenie grafu alebo textových výsledkov podľa typu otázky */}
      {type === QuestionType.EMOJI && <BarChart data={chartData} emojiLabels />}
      {type === QuestionType.INPUT && <TextResults answers={notEmptyAnswers} />}
      {type === QuestionType.CHOICE && <BarChart data={chartData} />}
      {type === QuestionType.RATE && <BarChart data={chartData} />}
    </div>
  );
}
