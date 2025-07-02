import * as Yup from 'yup'

const registerSchema = Yup.object().shape({
  first_name: Yup.string().min(3, "Minimal 3 Karakter").required("Wajib Diisi"),
  last_name: Yup.string().required("Wajib Diisi"),
  email: Yup.string().email("Format E-Mail Salah").required("Wajib Diisi"),
  password: Yup.string()
    .matches(/^(?=.*[a-z])(?=.*\d)[a-z\d]{8,}$/, "Minimal 8 Karakter, Angka dan Huruf")
    .required("Wajib Diisi"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), ''], 'Password Harus Cocok')
    .required('Wajib Diisi'),
  status_role: Yup.string().oneOf(['customer', 'organiser'], "Wajib Diisi").required('Wajib Diisi')
});


export default registerSchema