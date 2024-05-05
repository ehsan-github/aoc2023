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

(defn is-digit? [d] (let [v (- (int (apply char d)) 48)] (and (<= 0 v) (>= 9 v))))

(defn update-valid-nums [c valid-dim]
  (fn [vs] (let [{:keys [v dim]} (last vs)]
             (conj (vec (drop-last 1 vs)) {:v (+ (Integer/parseInt c) (* 10 v))
                                           :dim (if (some? valid-dim) (conj dim valid-dim) dim)}))))

(defn get-adj [idx len] (for [i (range (max 0 (- idx 1)) (min len (+ idx 2)))] i))

(defn common-part [simbol?]
  (fn [x]
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
                    valid-dim (first (filter some? (for [a adj
                                                         l (filter :l [{:l prev-line :idx (dec idx)} {:l line :idx idx} {:l next-line :idx (inc idx)}])]
                                                     (let [v (get (:l l) a)] (when (simbol? v) [(:idx l) a])))))
                    valid (<= 1 (count (filter simbol? all-adj)))]
                (if active-valid
                  (update acc :valid-nums (update-valid-nums c valid-dim))
                  (if (< 0 active-num)
                    (-> acc
                        (assoc :active-valid valid)
                        ((fn [x] (let [new-active (+ (Integer/parseInt c) (* 10 active-num))]
                                   (if valid
                                     (assoc x :valid-nums (conj (vec valid-nums) {:v new-active :dim #{valid-dim}}) :active-num new-active :active-valid true)
                                     (assoc x :active-num new-active))))))
                    (-> acc
                        (assoc
                         :active-valid valid
                         :active-num (Integer/parseInt c)
                         :valid-nums (if valid (conj valid-nums {:v (Integer/parseInt c) :dim #{valid-dim}}) valid-nums))))))
              (assoc acc :active-valid false :active-num 0)))
          {:prev-line prev-line :next-line next-line :active-valid false :valid-nums [] :active-num 0}
          (map-indexed vector line))))
     x)))

;; part 1
(->> input
     (str/split-lines)
     (map #(str/split % #""))
     ((fn [x] (for [[i v] (map-indexed vector x)] [i v])))
     ((common-part (fn [x] (and (not (is-digit? x)) (not= "." x)))))
     (map :valid-nums)
     (map #(map :v %))
     flatten
     (reduce +))

;; part-2
(->> input
     (str/split-lines)
     (map #(str/split % #""))
     ((fn [x] (for [[i v] (map-indexed vector x)] [i v])))
     ((common-part (fn [x] (= "*" x))))
     (map :valid-nums)
     (filter not-empty)
     flatten
     (group-by :dim)
     (map second)
     (map #(map :v %))
     (filter #(= 2 (count %)))
     (map #(apply * %))
     (reduce +))
     
