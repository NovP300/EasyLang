import { Link, useLocation } from "react-router-dom";

export default function MainPage() {
    const location = useLocation();
    return (
        <div>
            <div>
                <p>О нас, каталог языков .... </p>
                <Link to="/login" state={{ background: location }}>
                    <button>Войти</button>
                </Link>
                <Link to="/register" state={{ background: location }}>
                    <button>Зарегистрироваться</button>
                </Link>
            </div>

            <div>
                <p>Заголовок описание школы</p>
                <Link to="#">
                    <button>Попробовать бесплатно</button>
                </Link>
                <Link to="/login" state={{ background: location }}>У меня уже есть аккаунт</Link>

            </div>

            <div>
                <p>Начните изучать английский прямо сейчас!/</p>
                <Link to="/login" state={{ background: location }}>
                    <button>Начать заниматься</button>
                </Link>
            </div>

            <div>
                <p>Что приведет вас к результату?</p>
            </div>

            <div>
                <p>Выбери язык, который хочешь изучать</p>
                
            </div>


        </div>
    );
}
