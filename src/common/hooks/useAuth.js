import * as React from "react";
import { useContext } from "react";
//import AuthProvider from "@/common/providers/AuthProvider"; // ✅
import { AuthContext } from "@/common/providers/AuthProvider"; 

export default function useAuth() {

  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
