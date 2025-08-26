import { createContext, useState, useEffect, useContext } from "react";
import { apiClient, endpoints } from "../configs/Apis";
import { MyUserContext } from "./MyContext";


export const MyCourseContext = createContext([]);

export const MyCourseProvider = ({ children }) => {
    const { user } = useContext(MyUserContext);
    const [myCourses, setMyCourses] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchMyCourses = async () => {
            if (!user) {
                setMyCourses([]);
                return;
            }

            setLoading(true);
            try {
                let res = await apiClient().get(endpoints["my-courses"]);
                setMyCourses(res.data);
            } catch (err) {
                console.error("Error fetching my courses", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMyCourses();
    }, [user]);

    return (
        <MyCourseContext.Provider value={{ myCourses, setMyCourses, loading }}>
            {children}
        </MyCourseContext.Provider>
    );
};
