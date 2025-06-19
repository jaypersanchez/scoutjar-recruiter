import React from "react";
import { Link } from "react-router-dom";

export default function Page404() {
  return (
    <main className="flex flex-col items-center justify-center w-full h-screen bg-secondary">
      <h1 className="font-extrabold tracking-widest text-primary text-9xl">
        404
      </h1>
      <div className="absolute px-2 text-sm text-secondary bg-red-500 rounded rotate-12">
        Page Not Found
      </div>
      <Link
  to="/"
  className="relative inline-block text-sm font-medium text-primary group active:text-primary focus:outline-none focus:ring mt-5"
>
  <span className="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-primary group-hover:translate-y-0 group-hover:translate-x-0"></span>
  <span className="relative block px-8 py-3 border border-current bg-secondary">
    Go Home
  </span>
</Link>

    </main>
  );
}
