import Layout from '../hocs/Layout'



const homePage = () => (
    <Layout
        title='HTTPOnly Auth | Home'
        content='Home page for this auth tutorial on httpOnly cooikes with JWT'
    >
        <div className='p-5 bg0light rounded-3'>
            <div className='container-fluid py-3'>
                <h1 className='display-5 fw-bold'> Home page</h1>
                <p className='fs-4 mt-3'>
                   HTTP Only Auth with Cookie
                </p>
            </div>
        </div>
    </Layout>
);


export default homePage;