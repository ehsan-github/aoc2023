(ns index
  (:require [clojure.string :as str]))

(def input (slurp "src/day01/input.txt"))

(def test "1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet")

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


(defn part-1 [input]
  (->> input
       str/split-lines
       (map #(apply vector %))
       (map #(let [first (find-first is-digit? %)
                   last (find-last is-digit? %)
                   comb (str/join [first last])]
               (Integer/parseInt comb)))
       (reduce +)))

(part-1 input)
     

     
    


