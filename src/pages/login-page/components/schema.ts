import * as Yup from 'yup'

export const loginSchema = Yup.object().shape({
  email: Yup.string().email("Format Email Salah").required("Wajib Diisi"),
  password: Yup.string().required("Wajib Diisi"),
})