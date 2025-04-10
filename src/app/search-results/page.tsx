import { Suspense } from "react";
import SearchResultsClient from "@/components/SearchResultsClient/page";

const SearchResultsPage = () => {
  return (
    <Suspense fallback={<div className="p-6">Loading search results...</div>}>
      <SearchResultsClient />
    </Suspense>
  );
};

export default SearchResultsPage;
