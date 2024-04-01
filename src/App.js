import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import AppLayout from "./Layout/AppLayout";
import AppRouter from "./routes/AppRouter";
import "./style/common.style.css";

function App() {
  return (
    <div>
      <AppLayout>
        <AppRouter/>
      </AppLayout>
    </div>
  );
}

export default App;

/*
AppLayout
로그인 한 다음에 새로고침 했을 때 로그인 안풀리게 하고 로그인 또는 회원가입 페이지 이동 못하게 하기 위해 
세션 스토리지에 토큰 있으면 사용가능 토큰인지 확인 하는 api(/user/me) 호출 

AppRouter
/user/me 호출해서 토큰으로 user정보 받아와가지고 user있으면 로그인 또는 회원가입 url 이동 못하게 현재 위치로 리다이렉트
*/