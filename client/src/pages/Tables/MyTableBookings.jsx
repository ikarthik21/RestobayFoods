import { useQuery } from "@tanstack/react-query";
import restoApiInstance from "../../service/api/api";
import BlockWrapper from "@/_components/Wrappers/BlockWrapper";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import dayjs from "dayjs";

const MyTableBookings = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["resto-table-bookings"],
    queryFn: restoApiInstance.getTableBookings
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading table bookings</div>;
  }

  return (
    <BlockWrapper>
      <h1 className="anton tracking-wide text-2xl text-center text-[#ef5644]">
        Table Bookings
      </h1>
      <div>
        {data?.bookings?.length > 0 ? (
          data.bookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded m-2 bg-[#fde4c7] flex items-center py-2 shadow"
            >
              <div className="m-2">
                <TableRestaurantIcon
                  sx={{ color: "#5a5a5a", fontSize: "50px" }}
                />
              </div>
              <div className="ubuntu">
                <h2 className="font-semibold  text-[#ef5644] m-1">
                  Order ID :{"  "}
                  <span className="text-sm font-bold cursor-pointer underline  text-black">
                    {booking.id}
                  </span>
                </h2>
                <h2 className="font-semibold  text-[#ef5644] m-1">
                  Table :{"  "}
                  <span className="text-sm font-normal  text-black">
                    {booking.table_number}
                  </span>
                </h2>

                <h2 className="font-semibold  text-[#ef5644] m-1">
                  Status :{"  "}
                  <span className="text-sm font-normal mr-4 text-black">
                    {booking.status}
                  </span>
                  Date :{"  "}
                  <span className="text-sm font-normal  text-black">
                    {dayjs(booking.booking_date).format("MMM D, YYYY")}
                  </span>
                </h2>

                <h2 className="font-semibold  text-[#ef5644] m-1">
                  Start Time :{"  "}
                  <span className="text-sm font-normal  text-black mr-4">
                    {booking.start_time}
                  </span>
                  End Time :{"  "}
                  <span className="text-sm font-normal  text-black">
                    {booking.start_time}
                  </span>
                </h2>

                <h2 className="font-semibold  text-[#ef5644] m-1">
                  People :{"  "}
                  <span className="text-sm font-normal  text-black">
                    {booking.number_of_people}
                  </span>
                </h2>

                <h2 className="font-semibold m-1   text-[#ef5644]">
                  Amount :{"  "}
                  <span className="text-sm font-normal  text-black">
                    {booking.amount}
                  </span>
                </h2>
                <h2 className="font-semibold m-1  text-[#ef5644]">
                  Placed At :{"  "}
                  <span className="text-sm font-normal text-black">
                    {new Date(booking.updated_at).toLocaleString()}
                  </span>
                </h2>
              </div>
            </div>
          ))
        ) : (
          <p>No Bookings found</p>
        )}
      </div>
    </BlockWrapper>
  );
};

export default MyTableBookings;
