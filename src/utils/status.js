export const setOrderAndBadgeStatus = (items) => {
    let orderStatus = '';
    let badgeStatus = '';
    if(items.every((item) => item.status === 'refund')){
      orderStatus = '전체 환불 완료';
      badgeStatus = 'refund';
    } else if(items.some((item) => item.status === 'refund')){
      orderStatus = '부분 환불 완료';
      badgeStatus = 'refund';
    } else if(items.every((item) => item.status === 'return')){
      orderStatus = '전체 반품 요청';
      badgeStatus = 'return';
    } else if(items.some((item) => item.status === 'return')){
      orderStatus = '부분 반품 요청';
      badgeStatus = 'return';
    } else if(items.every((item) => item.status === 'cancel')){
      orderStatus = '전체 취소 요청';
      badgeStatus = 'cancel';
    } else if(items.some((item) => item.status === 'cancel')){
      orderStatus = '부분 취소 요청';
      badgeStatus = 'cancel';
    } else if(items.every((item) => item.status === 'delivered')){
      orderStatus = '전체 배송 완료';
      badgeStatus = 'delivered';
    } else if(items.some((item) => item.status === 'delivered')){
      orderStatus = '부분 배송 완료';
      badgeStatus = 'delivered';
    } else if(items.every((item) => item.status === 'shipping')){
      orderStatus = '전체 배송 중';
      badgeStatus = 'shipping';
    } else if(items.some((item) => item.status === 'shipping')){
      orderStatus = '부분 배송 중';
      badgeStatus = 'shipping';
    } else if(items.every((item) => item.status === 'preparing')){
      orderStatus = '상품 준비 중';
      badgeStatus = 'preparing';
    }
    return {orderStatus, badgeStatus};
  }