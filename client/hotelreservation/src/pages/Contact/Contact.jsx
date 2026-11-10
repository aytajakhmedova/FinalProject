import InquiryForm from '../../components/common/InquiryForm/InquiryForm';
import '../contentPages.css';

const Contact = () => (
  <div className="content-page" style={{ padding: '40px 16px', display: 'grid', justifyItems: 'center' }}>
    <InquiryForm />
  </div>
);

export default Contact;
