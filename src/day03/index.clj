(ns day03.index
  (:require [clojure.string :as str]))

(def input (slurp "src/day03/input.txt"))


(def test "467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..")

(defn is-digit? [d] (let [v (- (int (apply char d)) 48)]
                      (and (<= 0 v) (>= 9 v))))

(defn update-valid-nums [c]
  (fn [vs] (conj (vec (drop-last 1 vs)) (+ (Integer/parseInt c) (* 10 (last vs))))))

(defn get-adj [idx len] (for [i (range (max 0 (- idx 1)) (min len (+ idx 2)))] i))

(->> test
     (str/split-lines)
     (map #(str/split % #""))
     ((fn [x] (for [[i v] (map-indexed vector x)] [i v])))
     ((fn [x]
        (map
         (fn [[idx line]]
           (let [prev-line (when (< 0 idx) (nth (nth x (dec idx)) 1))
                 next-line (when (< idx (dec (count x))) (nth (nth x (inc idx)) 1))]
             (reduce
              (fn [acc [j c]]
                (if (is-digit? c)
                  (let [{:keys [prev-line next-line active-valid valid-nums active-num]} acc
                        adj (get-adj j (count line))
                        all-adj (for [a adj
                                      l (filter some? [prev-line line next-line])] (get l a))
                        valid (<= 1 (count (filter (fn [x] (and (not (is-digit? x)) (not= "." x))) all-adj)))]

                    (if active-valid
                      (update acc :valid-nums (update-valid-nums c))
                      (if (< 0 active-num)
                        (-> acc
                            (assoc :active-valid valid)
                            ((fn [x] (let [new-active (+ (Integer/parseInt c) (* 10 active-num))]
                                       (if valid
                                         (assoc x :valid-nums (conj (vec valid-nums) new-active) :active-num new-active :active-valid true)
                                         (assoc x :active-num new-active))))))

                        (-> acc
                            (assoc
                             :active-valid valid
                             :active-num (Integer/parseInt c)
                             :valid-nums (if valid (conj valid-nums (Integer/parseInt c)) valid-nums))))))

                  (assoc acc :active-valid false :active-num 0)))
              {:prev-line prev-line :next-line next-line :active-valid false :valid-nums [] :active-num 0}
              (map-indexed vector line)))) x)))
     (map :valid-nums)
     flatten
     (reduce +))
