"use client";

import { Button } from "@headlessui/react";
import useSWR from "swr";

interface Poll {
  _id: string;
  question: string;
  options: { text: string; votes: number }[];
}

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const {
    data: polls,
    error,
    isLoading,
    mutate,
  } = useSWR("/api/polls", fetcher, {
    refreshInterval: 10000, // Auto-refresh every 5 seconds
  });

  // Handle voting
  const vote = async (pollId: string, optionIndex: number) => {
    try {
      const res = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pollId, optionIndex }),
      });

      if (!res.ok) throw new Error("Failed to submit vote");

      mutate(); // Re-fetch data after voting
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Polls</h1>

      {isLoading ? (
        <p>Loading polls...</p>
      ) : error ? (
        <p className="text-red-500">Failed to load polls.</p>
      ) : polls.length === 0 ? (
        <p className="text-gray-500">No polls available.</p>
      ) : (
        <div className="w-full max-w-md">
          {polls.map((poll: Poll) => (
            <div key={poll._id} className="border p-4 mb-4 rounded shadow">
              <h2 className="font-semibold">{poll.question}</h2>
              <div className="mt-2">
                {poll.options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => vote(poll._id, index)}
                    className="w-full p-2 my-1 rounded transition focus:outline-none focus-visible:ring focus-visible:ring-blue-500 
             bg-blue-500 text-white hover:bg-blue-600"
                  >
                    {option.text} - {option.votes} votes
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
