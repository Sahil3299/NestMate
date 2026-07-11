// frontend/src/utils/formatters.js
import { formatDistanceToNow, format } from "date-fns";

export const formatRent = (amount) =>
  `₹${Number(amount).toLocaleString("en-IN")}`;

export const formatDate = (date) =>
  format(new Date(date), "dd MMM yyyy");

export const timeAgo = (date) =>
  formatDistanceToNow(new Date(date), { addSuffix: true });

export const getMatchColor = (score) => {
  if (score >= 90) return "bg-blue-600 text-white";
  if (score >= 75) return "bg-blue-500 text-white";
  if (score >= 60) return "bg-blue-100 text-blue-700";
  return "bg-gray-100 text-gray-600";
};

export const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

export const truncate = (str, len = 100) =>
  str?.length > len ? `${str.slice(0, len)}…` : str;
