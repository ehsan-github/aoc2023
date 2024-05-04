(ns day02
  (:require [clojure.string :as str]))

(def input (slurp "src/day02/input.txt"))

(defn common-part [input]
  (->> input
       (str/split-lines)
       (map #(str/split % #": "))
       (map (fn [[g v]]
              (let [[_ n] (str/split g #" ")
                    k (->> v
                           ((fn [x] (str/split x #"; |, ")))
                           (map #(str/split % #" "))
                           (reduce (fn [acc [v name]] (assoc acc name (max (Integer/parseInt v) (get acc name 0)))) {}))]
                [(Integer/parseInt n) k])))))

;; part-1
(->> input
     common-part
     (filter (fn [[_ k]] (and (>= 12 (get k "red")) (>= 13 (get k "green")) (>= 14 (get k "blue")))))
     (map first)
     (reduce +))

;; part-2
(->> input
     common-part
     (map #(->>
            %
            second
            ((fn [k] (map (fn [j] (get k j 0)) ["red" "green" "blue"])))
            (reduce *)))
     (reduce +))
