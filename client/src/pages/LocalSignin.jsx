const LocalSignin = () => {
    return (
        <form action="/login/password" method="post">
            <section>
                <label for="username">Username</label>
                <input id="username" name="username" type="text" autocomplete="username" required autofocus />
            </section>
            <section>
                <label for="current-password">Password</label>
                <input id="current-password" name="password" type="password" autocomplete="current-password" required />
            </section>
            <button type="submit">Login</button>
        </form>
    );
};

export default LocalSignin;
