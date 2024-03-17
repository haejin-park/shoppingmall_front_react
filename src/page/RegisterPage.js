import React, { useEffect, useState } from "react";
import { Alert, Button, Container, Form, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { userActions } from "../redux/actions/userAction";
import "../style/register.style.css";
import { Link } from "react-router-dom";
const RegisterPage = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    policy: false,
  });

  const navigate = useNavigate();
  const [passwordError, setPasswordError] = useState("");
  const [policyError, setPolicyError] = useState(false);
  const {loading, error} = useSelector((state) => state.user);

  const register = (event) => {
    event.preventDefault();
    const {email, name, password, confirmPassword, policy} = formData;
      // 비번 중복확인 일치하는지 확인
      if(password !== confirmPassword){
        setPasswordError("비밀번호가 일치하지 않습니다.");
        return;
      }
      // 이용약관에 체크했는지 확인
      if(!policy) {
        setPolicyError(true);
        return;
      }
      setPasswordError("");
      setPolicyError(false);
      // FormData에 있는 값을 가지고 백엔드로 넘겨주기
      dispatch(userActions.registerUser({email, name, password},navigate));      
  };

  const handleChange = (event) => {
    event.preventDefault();
    // 값을 읽어서 FormData에 넣어주기
    const {id, value, checked} = event.target;
    if(id === "policy") {
      setFormData({...formData, [id]:checked});
    } else {
      setFormData({...formData, [id]:value});
    }
  };

  useEffect(() => {

  }, [loading, error])

return (
  <Container className="register-area">
    {loading && (
        <div className="spinner-box">
        <Spinner animation="border" role="status">
          <span className="visually-hidden loading-message">Loading...</span>
        </Spinner>
      </div>
    )}
    {error && (
      <div>
        <Alert variant="danger" className="error-message">
          {error}
        </Alert>
      </div>
    )}
    <Form onSubmit={register}>
      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          id="email"
          placeholder="Enter email"
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          id="name"
          placeholder="Enter name"
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          id="password"
          placeholder="Password"
          autoComplete="off"
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control
          type="password"
          id="confirmPassword"
          placeholder="Confirm Password"
          autoComplete="off"
          onChange={handleChange}
          required
          isInvalid={passwordError}
        />
        <Form.Control.Feedback type="invalid">
          {passwordError}
        </Form.Control.Feedback>
      </Form.Group>
      <div className="mb-3 terms-and-link-box">
        <Form.Group>
          <Form.Check
            type="checkbox"
            label="이용약관에 동의합니다"
            id="policy"
            onChange={handleChange}
            isInvalid={policyError}
          />
        </Form.Group>
        <Link to="/login">로그인으로 돌아가기</Link>
      </div>
      <Button variant="danger" type="submit">
        회원가입
      </Button>
    </Form>
  </Container>
  );
};

export default RegisterPage;
