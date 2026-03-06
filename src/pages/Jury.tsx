// src/pages/Jury.tsx

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";

import Komolova from "@/assets/jury/Komolova.webp";
import Jalilova from "@/assets/jury/Jalilova.webp";
import Balland from "@/assets/jury/Balland.webp";
import Rasulova from "@/assets/jury/Rasulova.webp";

interface JuryMember {
  name: string
  title: string
  achievements: string[]
  location: string
  masterclass?: string
  photo: string
}

const juryMembers: JuryMember[] = [
  {
    name: "Комолова Мохинур Олимбой кизи",
    title: "Координатор союза молодежи Узбекистана в СЗФО РФ",
    achievements: [
      "Член Санкт-Петербургского союза дизайнеров",
      "Дизайнер костюма и аксессуаров",
      "Лауреат международных конкурсов и фестивалей",
      "Эксперт и спикер в области этно-моды"
    ],
    location: "Узбекистан / Россия (Ташкент — Санкт-Петербург)",
    masterclass: "Этно-мода и современный дизайн",
    photo: Komolova
  },

  {
    name: "Жалилова Саида Садирдин кизи",
    title: "Член Союза художников Узбекистана",
    achievements: [
      "Старший специалист музея Восточной миниатюры им. Камолиддина Бехзода",
      "Старший преподаватель Международного университета Кимё",
      "Эксперт классических искусств",
      "Мастер ручной шелковой бумаги"
    ],
    location: "Ташкент, Узбекистан",
    masterclass: "Мастер-класс по миниатюре",
    photo: Jalilova
  },

  {
    name: "Балланд Татьяна Валерьевна",
    title: "Профессор кафедры дизайна костюма СПбГУПТД",
    achievements: [
      "Кандидат философских наук",
      "Доцент",
      "Призер международных конкурсов дизайна костюма",
      "Специалист компьютерной графики"
    ],
    location: "Санкт-Петербург, Россия",
    masterclass: "Цифровое моделирование костюма",
    photo: Balland
  },

  {
    name: "Расулова Эльнура Фархатовна",
    title: "Преподаватель Республиканской специализированной школы дизайна",
    achievements: [
      "Промышленный дизайн",
      "Рисунок и живопись",
      "Эксперт художественного образования"
    ],
    location: "Ташкент, Узбекистан",
    masterclass: "Resin-Art",
    photo: Rasulova
  }
]

export default function Jury() {

  const { lang } = useI18n()
  const [selected, setSelected] = useState<JuryMember | null>(null)

  return (

    <div className="bg-background">

      {/* HERO */}

      <section className="gradient-hero text-primary-foreground">

        <div className="container mx-auto px-4 py-20 lg:py-28 text-center">

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl lg:text-6xl font-bold"
          >
            {lang === "ru" ? "Жюри конкурса" : "Competition Jury"}
          </motion.h1>

          <div className="ornament-divider my-6">
            <span className="text-gold text-xl">✦</span>
          </div>

          <p className="max-w-xl mx-auto text-primary-foreground/70 text-lg">
            {lang === "ru"
              ? "Выдающиеся художники, дизайнеры и эксперты международного уровня."
              : "Outstanding artists and experts evaluating the competition."}
          </p>

        </div>

      </section>

      {/* GRID */}

      <section className="container mx-auto px-4 py-16">

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">

          {juryMembers.map((member, i) => (

            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-border rounded-xl overflow-hidden shadow-soft hover:shadow-lg transition"
            >

              <div className="aspect-[4/5] overflow-hidden">

                <img
                  src={member.photo}
                  alt={member.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition duration-500 hover:scale-105"
                />

              </div>

              <div className="p-4 lg:p-6">

                <h3 className="font-display text-sm lg:text-lg font-semibold">
                  {member.name}
                </h3>

                <p className="text-gold text-xs lg:text-sm mt-1">
                  {member.title}
                </p>

                {/* КНОПКА */}

                <button
                  onClick={() => setSelected(member)}
                  className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-xs lg:text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
                >
                  {lang === "ru" ? "Подробнее" : "Details"}
                </button>

              </div>

            </motion.div>

          ))}

        </div>

      </section>

      {/* MODAL */}

      <AnimatePresence>

        {selected && (

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => setSelected(null)}
          >

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-background rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 lg:p-8"
              onClick={(e) => e.stopPropagation()}
            >

              <img
                src={selected.photo}
                className="w-full h-[420px] object-cover rounded-lg mb-6"
              />

              <h2 className="font-display text-2xl lg:text-3xl font-semibold">
                {selected.name}
              </h2>

              <p className="text-gold mt-1 text-lg">
                {selected.title}
              </p>

              <p className="text-sm text-muted-foreground mt-2">
                {selected.location}
              </p>

              <ul className="mt-6 space-y-2 text-sm text-muted-foreground">

                {selected.achievements.map((a, i) => (
                  <li key={i}>• {a}</li>
                ))}

              </ul>

              {selected.masterclass && (

                <div className="mt-6 pt-4 border-t">

                  <strong>
                    {lang === "ru"
                      ? "Мастер-класс:"
                      : "Masterclass:"}
                  </strong>

                  <p className="text-sm mt-1">
                    {selected.masterclass}
                  </p>

                </div>

              )}

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

    </div>

  )

}