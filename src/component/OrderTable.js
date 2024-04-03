import React from "react";
import { Badge, Table } from "react-bootstrap";
import { badgeBg } from "../constants/order.constants";
import { currencyFormat } from "../utils/number";
const OrderTable = ({ header, orderList, openEditForm }) => {
  return (
    <div className="overflow-x">
      {orderList.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              {header.map((title) => (
                <th>{title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orderList.map((item, index) => (
              <tr onClick={() => openEditForm(item)}>
                <th>{index}</th>
                <th>{item.orderNum}</th>
                <th>{item.createdAt.slice(0, 10)}</th>
                <th>{item.userId.email}</th>
                {item.items.length > 0 ? (
                  <th>
                    {item.items[0].productId.name}
                    {item.items.length > 1 && `외 ${item.items.length - 1}개`}
                  </th>
                ) : (
                  <th></th>
                )}
                <th>{item.shipTo.address + " " + item.shipTo.city}</th>
                <th>{currencyFormat(item.totalPrice)}</th>
                <th>
                  <Badge bg={badgeBg[item.status]}>{item.status}</Badge>
                </th>
              </tr>
            ))}
          </tbody>
        </Table>
        ) : (
        <div className="empty">
          <h3>조회된 주문이 없습니다</h3>
        </div>
        )}
    </div>
  );
};
export default OrderTable;
