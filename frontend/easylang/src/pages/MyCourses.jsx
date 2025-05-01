import styles from "./Style (css)/MyCourses.module.css";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
export default function MyCourses() {
    const courses = [
        {
            id: 1,
            title: "Английский язык",
            completedModules: 3,
            totalModules: 15,
            completed: false,
        },
    ];

    const completedCount = courses.filter((c) => c.completed).length;

    return (
        <div>
            {/* Секция профиля */}
            <section className={styles.profileSection}>
                <h2 className={styles.profileName}>Фамилия Имя</h2>
                <p className={styles.profileStats}>Количество пройденных курсов: {completedCount}</p>
                <p className={styles.profileStats}>Количество начатых курсов: {courses.length}</p>
            </section>

            {/* Секция курсов */}
            <section className={styles.courseSection}>
                <h3 className={styles.courseHeader}>Всего {courses.length} курс</h3>

                <div className={styles.courseList}>
                    {courses.map((course) => (
                        <div key={course.id} className={styles.courseCard}>
                            {/* Левая колонка */}
                            <div className={styles.iconBox}>
                                <FaCheckCircle size={30} color="#4CAF50" />
                            </div>

                            {/* Центральная колонка */}
                            <div className={styles.courseInfo}>
                                <h4 className={styles.courseTitle}>{course.title}</h4>
                                <p className={styles.progressText}>
                                    Пройдено {course.completedModules} модулей из {course.totalModules}
                                </p>
                                <button className={styles.leaveBtn}>Покинуть курс</button>
                            </div>

                            {/* Правая колонка */}
                            <div className={styles.linkBox}>
                                <Link to={`/languages/${course.id}`} className={styles.linkBtn}>
                                    Перейти к материалам курса
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
