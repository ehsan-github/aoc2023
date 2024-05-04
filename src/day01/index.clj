(ns index
  (:require [clojure.string :as str]))

(def input (slurp "src/day01/input.txt"))

(let [zero (int \0)
      nine (int \9)]
  (defn is-digit? [c] (<= zero (int c) nine)))

(is-digit? \a)

(defn find-first
  [f coll]
  (first (filter f coll)))

(defn find-last
  [f coll]
  (first (filter f (reverse coll))))


;; part-1
(->> input
     str/split-lines
     (map #(apply vector %))
     (map #(let [first (find-first is-digit? %)
                 last (find-last is-digit? %)
                 comb (str/join [first last])]
             (Integer/parseInt comb)))
     (reduce +))


;; part-2
(def find-number
  {"one" "1",
   "two" "2",
   "three" "3",
   "four" "4",
   "five" "5",
   "six" "6",
   "seven" "7",
   "eight" "8",
   "nine" "9"})

(->> input
     str/split-lines
     (map (fn [x]
            (let [a (re-find #"[0-9]|zero|one|two|three|four|five|six|seven|eight|nine" x)
                  b-r (re-find #"[0-9]|eno|owt|eerht|ruof|evif|xis|neves|thgie|enin|orez" (apply str (reverse x)))
                  b (apply str (reverse b-r))
                  a-num (get find-number a a)
                  b-num (get find-number b b)
                  res (Integer/parseInt (str a-num b-num))]
              res)))
     (reduce +))
