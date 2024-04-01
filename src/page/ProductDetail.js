import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Container, Dropdown, Form, InputGroup, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { cartActions } from "../redux/actions/cartAction";
import { commonUiActions } from "../redux/actions/commonUiAction";
import { commonProductActions } from "../redux/actions/commonProductAction";
import "../style/productDetail.style.css";

const ProductDetail = ({mode, cartProductId, setShowDialog, setMode}) => {
  // console.log('mode', mode);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useSelector((state) => state.user);
  const { product, loading, error } = useSelector((state) => state.commonProduct);
  const { selectedItem, searchKeyword, currentPage } = useSelector((state) => state.cart);
  const [ cartItemInitialOption ] = useState([[selectedItem?.items?.size, selectedItem?.items?.qty]]);
  const [ selectedOption, setSelectedOption ] = useState(mode === "edit"? [[selectedItem?.items?.size, selectedItem?.items?.qty]] : []);
  const [ optionChangeStatus, setOptionChangeStatus ] = useState(false);
  const [ sizeError, setSizeError ] = useState(false);
  const [ qtyError, setQtyError ] = useState(false);
  const [ totalPrice, setTotalPrice ] = useState(0);

/*
todo 
  장바구니 상품 기존 옵션과 선택한 옵션 일치하지 않으면 (optionChangeStatus true일 때) 
  => 장바구니 옵션 수정시 완료 버튼 활성화

  optionChangeStatus 
  => false disabled
  => true  버튼 활성화

  selectedOption[i][0] => 사이즈
  selectedOption[i][1] => 수량 

  버튼 사용 불가능한 경우 setOptionChangeStatus(false)
  => selectedOption의 길이가 0보다 작은 경우 
  => selectedOption의 길이가 0이상이고 && 길이가 같고 && (수량 일치 && 사이즈 일치)

  사용 가능 한 경우 setOptionChangeStatus(true)
  => selectedOption의 길이가 0이상이고 && 길이가 다른 경우 && 수량이 1이상
  => selectedOption의 길이가 0이상이고 && 길이가 같고 && 수량이 1이상 && (수량 일치 하지 않거나 || 사이즈 일치하지 않거나) 
*/

  useEffect(() => {
    if(selectedOption.length <= 0) {
      setOptionChangeStatus(false);
      return;
    } 
    if(cartItemInitialOption.length !== selectedOption.length) {
      for(let i = 0; i < cartItemInitialOption.length; i++) {
        // console.log('길이가 다른 경우 : 기존 옵션 사이즈, 수량', cartItemInitialOption[i][0], cartItemInitialOption[i][1]);
        // console.log('길이가 다른 경우 : 선택 옵션 사이즈, 수량', selectedOption[i][0], selectedOption[i][1]);
          if(selectedOption[i][1] >= 1) {
            setOptionChangeStatus(true);
            break;
          }
        }
    } else { 
      for(let i = 0; i < cartItemInitialOption.length; i++) {
        // console.log('길이가 같은 경우 : 기존 옵션 사이즈, 수량', cartItemInitialOption[i][0], cartItemInitialOption[i][1]);
        // console.log('길이가 같은 경우 : 선택 옵션 사이즈, 수량', selectedOption[i][0], selectedOption[i][1]);
        if(cartItemInitialOption[i][0] !== selectedOption[i][0] || cartItemInitialOption[i][1] !== selectedOption[i][1]) {
          if(selectedOption[i][1] >= 1) {
            setOptionChangeStatus(true);
            break;
          }
        } 
        setOptionChangeStatus(false);
      }
    }
  }, [cartItemInitialOption, selectedOption])
  
  useEffect(() => {
    //상품 디테일 정보 가져오기
    if(id) {
      dispatch(commonProductActions.getProductDetail(id));
    } else if(cartProductId) {
      dispatch(commonProductActions.getProductDetail(cartProductId));
    }
  }, [id, cartProductId, dispatch]);

  useEffect(() => {
    if(selectedOption.length > 0) {
      const totalPrice = selectedOption.reduce((total, option) => {
        let sizePrice = product.price;
        if(option[1]) {
          sizePrice *=  parseInt(option[1]); //사이즈 수량 있으면 곱해주기
        } else {
          sizePrice = 0
        } 
        return total + sizePrice//사이즈만 선택했을 땐 수량은 selectedOption에 존재하지 않는 상태
      },0)
      setTotalPrice(totalPrice)
    } 
  },[product.price, selectedOption]);


 /*
 => cartItemInitialOption과 다른 변경 사항만 add되도록
 
 ex)
 기존 옵션 cartItemInitialOption 
[['M', 1]] => 객체 변환시 {M:1}
 
선택 옵션 selectedOption 
[['S', 1], ['M', 2]] => 객체 변환시 {S:1, M:2}

1. mode가 edit이고, optionChangeStatus true일 때

2. 객체로 변경(선택한건 원래 바꾸게 되어있었으니까 기존 옵션만 추가로 객체로 바꿔주면 됨)

3. 
방식1) 변경 사항만 보낼 경우 (프론트에서 작업해서 백엔드 addItemToCart 재사용)
두 객체의 키를 모두 포함한 배열 생성
각 키에 대한 비교 
=> 각각 키가 있는 경우 => 수량 다른 경우 update
=> 기존 옵션만 키가 있는 경우 => 삭제
=> 선택한 옵션만 키가 있는 경우 => 추가 

방식2) 선택한 옵션을 그대로 백엔드에 보낼 경우
=> userId로 카트 전체 상품 조회(바꿀 아이템 기존 옵션과 다른 경우 => 상품 아이디와 사이즈로 일치 여부 비교후 수량 증가 또는 추가하기 위해 조회)
=> userId와 카트 아이템 id로 일치하는 아이템 조회(기존 아이템과 비교하기 위해 조회)
1. 기존 사이즈가 다른 경우 => 추가
2. 기존 수량과 다른 경우 => 수량 비교후 기존 수량보다 많으면 증가, 적으면 감소
 */ 
  const addItemToCart = () => {
    //선택한 옵션(사이즈)이 없다면 에러
    if(selectedOption.length === 0) {
      setSizeError(true);
      return;
    }

    //수량이 1보다 작아서 에러가 있다면 return
    if(qtyError) {
      return;
    }

    if(!user) {
      dispatch(commonUiActions.showToastMessage("로그인 후 이용 가능합니다.", "error"));
      navigate('/login');
      return;
    }

    // 선택한 옵션을 배열에서 객체로 변경 => ex) [['S',1], ['M',2]] 에서 {S:1, M:2}로
    let selectedOptionObj =  Object.fromEntries(selectedOption);

    // 카트에 아이템 추가하기
    if(id && !mode) {
      dispatch(cartActions.addToCart(id, selectedOptionObj));
    } else if (cartProductId && mode ==="edit") {
      let cartItemInitialOptionObj =  Object.fromEntries(cartItemInitialOption);
      
      // 두 객체의 키를 모두 포함한 배열 생성
      const allKeys = Array.from(new Set([...Object.keys(cartItemInitialOptionObj), ...Object.keys(selectedOptionObj)]));

      // 각 키에 대해 비교 작업 수행
      allKeys.forEach((key) => {
        const initialValue = cartItemInitialOptionObj[key];
        const selectedValue = selectedOptionObj[key];

        if (initialValue && selectedValue) { // 둘 다 있는 경우: 수량 비교
          if (initialValue !== selectedValue) { //초기값과 다른 경우 : 수량 변경 update
            let updatedOptionObj = {};
            updatedOptionObj[key] = selectedValue;
            dispatch(cartActions.updateCartItemQty(cartProductId, updatedOptionObj, {searchKeyword, currentPage}));
          }
        
        } else if (initialValue && !selectedValue) { // 기존 옵션에만 있는 경우: 삭제   
          dispatch(cartActions.deleteCartItem(selectedItem.items._id, {searchKeyword, currentPage}));

        } else if (!initialValue && selectedValue) {  // 선택한 옵션에만 있는 경우: 추가 
          let updatedOptionObj = {};
          updatedOptionObj[key] = selectedValue;
          dispatch(cartActions.addToCart(cartProductId, updatedOptionObj, {searchKeyword, currentPage}, mode));
        }
      });
      setShowDialog(false);
      setMode("");
    }
    
    //추가 후 초기화
    setSelectedOption([]);
    setTotalPrice(0);
  };

  const handleSelectSize = (value) => {
    // 사이즈 선택하기(처음 사이즈 선택할 때 수량 1로 세팅되게)
    if(selectedOption?.length > 0){
      let newOption = [...selectedOption, [value,1]];
      setSelectedOption(newOption); 
    } else {
      setSelectedOption([[value,1]]);
    }
    setSizeError(false);     
  };

  /* 
    todo 
    product.stock반복 돌려서
    product.stock의 키값이 일치하면 
    product.stock["키값(해당 사이즈)"]으로 수량구해서 그것 보다 적거나 같은 수량까지만 장바구니에 담을 수 있도록 하기
  */
  const handleIncrement = (index) => {
    const newSelectedOption = [...selectedOption];
      if(newSelectedOption[index][1] >= 1) {
        newSelectedOption[index][1] += 1; 
      } else {
        newSelectedOption[index][1] = 1; 
      }
      setQtyError(false); // newSelectedOption[index][1]가 1이상이면 에러 메세지 사라지게
      setSelectedOption([...newSelectedOption]);
  };

  const handleDecrement = (index) => {
    const newSelectedOption = [...selectedOption];
    if (newSelectedOption[index][1] >= 1) {
      newSelectedOption[index][1] -= 1; 
    } 
    newSelectedOption[index][1] <= 0 && setQtyError(true);  // newSelectedOption[index][1]가 0이하이면 에러 메세지
    setSelectedOption([...newSelectedOption]);
  }

  const handleSelectQty = (value, index) => {
    //value는 수량, index는 selectedOption의 인덱스
    const newSelectedOption = [...selectedOption];
    newSelectedOption[index][1] = parseInt(value)
    value <= 0 || newSelectedOption[index][1] <= 0 ? setQtyError(true) : setQtyError(false); //변경 수량값이 0이하이거나 수량이 0이면 에러 메세지, 아니면 사라지게
    setSelectedOption([...newSelectedOption]);
  };

  const deleteSelectedOption = (index) => {
    const newSelectedOption = selectedOption.filter((option, idx) => index !== idx);
    setSelectedOption(newSelectedOption);
    const totalPrice = newSelectedOption.reduce((total, option) => {
      let sizePrice =  product.price; 
      if(option[1]) {
        sizePrice *= parseInt(option[1]);  
      } else {
        sizePrice = 0;
      }
      return total + sizePrice
    },0);
    setTotalPrice(totalPrice);
  }


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
                <Col sm={2} xs={2}>
                  {item[0]}
                </Col>
                <Col sm={8} xs={8}>
                  <InputGroup>
                    <Button variant="outline-secondary" onClick={() => handleDecrement(index)}>-</Button>
                      <Form.Control
                        type="number"
                        value={item[1] || ''}
                        onChange={(event) => handleSelectQty(event.target.value, index)}
                      />
                    <Button variant="outline-secondary" onClick={() => handleIncrement(index)}>+</Button>
                  </InputGroup>
                </Col>
                <Col sm={2} xs={2}>
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
          <div className="warning-message">
            {qtyError && "수량 1개 이상 선택가능합니다."}
          </div>
          <strong>Total: {totalPrice}</strong>
          {mode === "edit" ? (
          <Row className="cart-btn-row">
            <Col>
              <Button className="cart-cancel-btn" variant="secondary">
                취소
              </Button>
            </Col>
            <Col>
              <Button className="cart-complete-btn" variant="dark" onClick={addItemToCart} disabled={!optionChangeStatus}>
                완료
              </Button>
            </Col>
          </Row>
          ): (
          <Button className="add-button" variant="dark" onClick={addItemToCart}>
            추가
          </Button>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;
