import { useQuery } from "@tanstack/react-query";
import restoApiInstance from "../../service/api/api";
import BlockWrapper from "@/_components/Wrappers/BlockWrapper";
const Orders = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["resto-orders"],
    queryFn: restoApiInstance.getOrders
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading orders</div>;
  }

  return (
    <BlockWrapper>
      <h1 className="anton tracking-wide text-xl text-[#ef5644]">Orders</h1>
      <div>
        {data?.orders?.length > 0 ? (
          data.orders.map((order) => (
            <div
              key={order.id}
              className="rounded m-2 bg-[#fde4c7] flex items-center py-2 shadow"
            >
              <div className="m-2">
                <img
                  src="https://restobay.vercel.app/images/vt.jpg"
                  className="h-28 w-28 rounded"
                  alt=""
                />
              </div>
              <div className="ubuntu">
                <h2 className="font-semibold  text-[#ef5644] m-1">
                  Order ID :{"  "}
                  <span className="text-sm font-bold cursor-pointer underline  text-black">
                    {order.id}
                  </span>
                </h2>
                <h2 className="font-semibold  text-[#ef5644] m-1">
                  Status :{"  "}
                  <span className="text-sm font-normal  text-black">
                    {order.status}
                  </span>
                </h2>
                <div className="flex items-center">
                  <h2 className="font-semibold m-1 mr-1 text-[#ef5644]">Items :</h2>
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center">
                      <span className="mr-2 text-sm text-black">
                        {item.name} x{item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
                <h2 className="font-semibold m-1   text-[#ef5644]">
                  Amount :{"  "}
                  <span className="text-sm font-normal  text-black">
                    {order.total_amount}
                  </span>
                </h2>
                <h2 className="font-semibold m-1  text-[#ef5644]">
                  Placed At :{"  "}
                  <span className="text-sm font-normal text-black">
                    {new Date(order.updated_at).toLocaleString()}
                  </span>
                </h2>
              </div>
            </div>
          ))
        ) : (
          <p>No orders found</p>
        )}
      </div>
    </BlockWrapper>
  );
};

export default Orders;
