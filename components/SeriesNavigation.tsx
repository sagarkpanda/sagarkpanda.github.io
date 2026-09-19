"use client";

import { useState } from "react";
import Link from "next/link";

export type SeriesArticle = {
  title: string;
  route: string;
  order: number;
};

export type SeriesGroup = {
  name: string;
  currentIndex: number;
  articles: SeriesArticle[];
};

export default function SeriesNavigation({
  series,
}: {
  series: SeriesGroup[];
}) {
  const [activeSeries, setActiveSeries] =
    useState(0);

  if (!series.length) {
    return null;
  }

  const active = series[activeSeries];

  if (!active) {
    return null;
  }

  const currentArticle =
    active.articles[active.currentIndex - 1];

  return (
    <div className="series-panel">
      {series.length > 1 && (
        <div
          className="series-tabs"
          role="tablist"
        >
          {series.map((item, index) => (
            <button
              key={item.name}
              type="button"
              role="tab"
              aria-selected={
                activeSeries === index
              }
              className={`series-tab ${
                activeSeries === index
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActiveSeries(index)
              }
            >
              <span>{item.name}</span>

              <span>
                {item.currentIndex}/
                {item.articles.length}
              </span>
            </button>
          ))}
        </div>
      )}

      <div className="series-panel-header">
        <div
          className="series-name"
          title={active.name}
        >
          {active.name}
        </div>

        <div className="series-count">
          {active.currentIndex}/
          {active.articles.length}
        </div>
      </div>

      <nav
        className="series-list"
        aria-label={`${active.name} series`}
      >
        {active.articles.map((article) => {
          const isCurrent =
            article.route ===
            currentArticle?.route;

          return (
            <Link
              key={article.route}
              href={article.route}
              className={`series-item ${
                isCurrent
                  ? "current"
                  : ""
              }`}
              aria-current={
                isCurrent ? "page" : undefined
              }
            >
              <span className="series-order">
                {article.order}
              </span>

              <span
                className="series-title"
                title={article.title}
              >
                {article.title}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}