import React, { useEffect, useState } from "react";

export default function HumanCapitalNews() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_NEWS_API_KEY;
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 7);
    const from = fromDate.toISOString().split("T")[0];

    const query = encodeURIComponent(
    `"talent acquisition" OR "job market" OR hiring OR recruitment OR "HR technology" OR "human capital" OR "jobs report"`
    );

    const url = `https://newsapi.org/v2/everything?q=${query}&from=${from}&sortBy=publishedAt&language=en&pageSize=10&apiKey=${apiKey}`;


    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.articles) setNews(data.articles);
      })
      .catch(err => console.error("Failed to load news:", err));
  }, []);

  return (
    <div className="p-4 bg-white rounded-md shadow w-full">
      <h2 className="text-xl font-semibold mb-4">Top News in Human Capital</h2>
      <ul className="space-y-3">
        {news.map((item, idx) => (
          <li key={idx} className="border-b pb-2">
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {item.title}
            </a>
            <div className="text-xs text-gray-500">
              {item.source.name} — {new Date(item.publishedAt).toLocaleDateString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
