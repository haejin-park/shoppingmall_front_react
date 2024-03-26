import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Container, Dropdown, Form, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { cartActions } from "../redux/actions/cartAction";
import { commonUiActions } from "../redux/actions/commonUiAction";
import { commonProductActions } from "../redux/actions/commonProductAction";
import "../style/productDetail.style.css";

const ProductDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useSelector((state) => state.user);
  const { product, loading, error } = useSelector((state) => state.commonProduct);
  const [ selectedOption, setSelectedOption ] = useState([]);
  const [ sizeError, setSizeError ] = useState(false);

  const addItemToCart = () => {
    //선택한 옵션(사이즈)이 없다면 에러
    if(selectedOption.length === 0) {
      setSizeError(true);
      return;
    }

    // 선택한 옵션 배열 반복 돌리며 비어있는 수량은 1로 설정
    let newSelectedOption = selectedOption.map((option) => {
      if(!option[1]) {
        let updateOptionQty = [...option];
        updateOptionQty[1] = 1 
        return updateOptionQty;
      } 
      return option
    });
    setSelectedOption(newSelectedOption);

    // 선택한 옵션을 배열에서 객체로 변경 => ex) [['S',1], ['M',2]] 에서 {S:1, M:2}로
    let selectedOptionObj = newSelectedOption.reduce((total, item) => {
      return {...total, [item[0]]: parseInt(item[1])};
    },[]);

    if(!user) {
      dispatch(commonUiActions.showToastMessage("로그인 후 이용 가능합니다.", "error"));
      navigate('/login');
      return;
    }
    // 카트에 아이템 추가하기
    dispatch(cartActions.addToCart({id, selectedOptionObj}));
    //추가 후 초기화
    setSelectedOption([]);
  };
  const handleSelectSize = (value) => {
    // 사이즈 선택하기
    if(selectedOption?.length > 0){
      let newOption = [...selectedOption, [value]];
      setSelectedOption(newOption); 
    } else {
      setSelectedOption([[value]]);
    }
    setSizeError(false);     
  };

  const handleSelectQty = (value, index) => {
    //value는 수량, index는 selectedOption의 인덱스
    const newSelectedOption = [...selectedOption];
    if(value >= 1) {
      newSelectedOption[index][1] = value;
    } else {
      newSelectedOption[index][1] = 1;
    }
    setSelectedOption([...newSelectedOption]);
  };

  const deleteSelectedOption = (index) => {
    const newSelectedOption = selectedOption.filter((option, idx) => index !== idx);
    setSelectedOption(newSelectedOption);
  }

  useEffect(() => {
    //상품 디테일 정보 가져오기
    dispatch(commonProductActions.getProductDetail(id));
  }, [id]);

  return (
    <Container className="product-detail-card">
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
      <Row>
        <Col sm={6}>
          <img src={product.image} className="w-100" alt={product.name} />
        </Col>
        <Col className="product-info-area" sm={6}>
          <div className="product-info">{product.name}</div>
          <div className="product-info">₩ {product.price}</div>
          <div className="product-info">{product.description}</div>

          <Dropdown
            className="drop-down size-drop-down"
            align="start"
            onSelect={(value) => handleSelectSize(value)}
          >
            <Dropdown.Toggle
              className="size-drop-down"
              variant={sizeError ? "outline-danger" : "outline-dark"}
              id="dropdown-basic"
              align="start"
            >
            사이즈 선택
            </Dropdown.Toggle>
            <Dropdown.Menu className="size-drop-down">
              {product.stock && Object.keys(product?.stock).map((size, index) => (
                <Dropdown.Item 
                  key={index} 
                  eventKey={size}
                  disabled={selectedOption.some(
                    (option) => option[0].toUpperCase() === size.toUpperCase()
                  )}
                >
                  {`${size} (재고 수량 ${product?.stock[size]})`}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>          
          {selectedOption?.map((item, index) => (
            <div className="selected-option-box" key={index}>
              <Row className="selected-option-row">
                <Col sm={2}>
                  {item[0]}
                </Col>
                <Col sm={8}>
                  <Form.Control
                    onChange={(event) =>
                      handleSelectQty(event.target.value, index)
                    }
                    type="number"
                    value={item[1] || 1}
                    required
                  />
                </Col>
                <Col sm={2}>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => deleteSelectedOption(index)}
                  >
                    -
                  </Button>
                </Col>
              </Row>
            </div>
          ))}
          <div className="warning-message">
            {sizeError && "사이즈를 선택해주세요."}
          </div>
          <Button variant="dark" className="add-button" onClick={addItemToCart}>
            추가
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;
