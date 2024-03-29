import { useNavigate, useParams } from "react-router-dom"
import { useState, useRef, useEffect } from "react"
// import useAxiosFunction from '../../hooks/useAxiosFunction';
import { toast } from 'react-toastify';
import { useMainContext } from "../../contexts/MainProvider"
import { productSchema } from "../../validations/productSchema";
import useForm from "../../hooks/useForm"
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { MdDriveFolderUpload } from "react-icons/md";
import { Container, Button, LoadingButton, Input, PageHeader } from '../../components';
import { FaInfoCircle } from 'react-icons/fa';
import InputSelect from "../../components/Input/InputSelect";
import Loader from "../../components/Loader/Loader";
// import ImageHolder from '../../../images/image-holder.jpg'
import ImageHolder from "./../../../assets/images/image-holder.jpg"
import { getEffectiveTypeRoots } from "typescript";

import ProductCSS from "./Product.module.css"


const inititalDirtyFields = {
  brandId: false,
  categoryId: false,
  name: false,
  description: false,
  images: false,
  pixelPitch: false,
  moduleSize: false,
  cabinetSize: false,
}


const ProductEdit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate()
  const inputFileRef = useRef(null);
  const [product, setProduct] = useState();
  const { productId } = useParams();
  const [uploading, setUploading] = useState(false);
  const [brands, setBrands] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState({});
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [selectedImage, setSelectedImage] = useState()

  const handleMap = () => {

    console.log(values.attributeValues)
    let attr = Object.keys(values.attributeValues).map((key) => values.attributeValues[key])

    console.log(attr)
  }

  const handleAttributeValuesChange = async (e) => {
    const { name, value } = e.target;

    setValues(prev => {
      if (values.attributeValues) {
        return {
          ...prev,
          attributeValues: [
            ...prev?.attributeValues,
            { id: value }
          ]
        }
      } else {
        return {
          ...prev,
          attributeValues: [
            { id: value }
          ]
        }
      }
    })



    console.log(values.attributeValues)

    // let attributeValues = Object.keys(updatedAttributeValues).map((key) => updatedAttributeValues[key])



  }
  const uploadImageHandler = async (e) => {
    try {
      setUploading(true);
      let formData = new FormData();
      formData.append("avatar", e.target.files[0]);

      const res = await axiosPrivate.post("/upload/avatar", formData);

      console.log(res.data.url)


      setValues(prev => {
        if (values.images) {
          return {
            ...prev,
            images: [
              ...prev?.images,
              { url: res.data.url }
            ]
          }
        } else {
          return {
            ...prev,
            images: [
              { url: res.data.url }
            ]
          }
        }

      })


    } catch (err) {
      console.log(err);
      toast.error(err.response.data.msg, {
        className: "toast-failed",
        bodyClassName: "toast-failed",
      });
    } finally {
      setUploading(false);
    }
  };




  const { values, setValues, errors, isValid, handleChange, handleSubmit } = useForm(inititalDirtyFields, productSchema, async (e) => {
    e.preventDefault();
    setIsSubmitting(true)

    let mappedValues = Object.keys(selectedAttributes).map((key) => selectedAttributes[key])




    try {
      let data = {
        brandId: values.brandId,
        categoryId: values.categoryId,
        // typeId: values.typeId,
        name: values.name,
        // description: values.description,
        images: values.images,
        // attributeValues: mappedValues
        pixelPitch: values.pixelPitch,
        moduleSize: values.moduleSize,
        cabinetSize: values.cabinetSize,
      }

      let res

      if (productId) {
        res = await axiosPrivate.put('/products/' + productId, data);
        toast.success('Updated!');
      } else {
        res = await axiosPrivate.post('/products/', data);
        toast.success('Created!');
        navigate('/admin/product/list')
      }

    } catch (err) {
      toast.error(err);
    } finally {
      setIsSubmitting(false);
    }

  });
  const getTypes = async () => {
    try {
      const res = await axiosPrivate.get('/types/');
      const mappedData = res.data.map((type) => {
        return {
          value: type.id,
          label: type.name,
          attributes: type.attributes.map((attribute) => {
            return {
              value: attribute.id,
              label: attribute.name,
              values: attribute.values.map((value) => {
                return { value: value.id, label: value.name }
              })
            }
          })

        }
      })
      setTypes(mappedData)

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
  //   const getAttributes = async () => {
  //     try {
  //       const res = await axiosPrivate.get('/attributes/');
  //       const mappedData = res.data.map((attribute) => {

  //         return {
  //           value: attribute.id,
  //           label: attribute.name,
  //           values: attribute.values.map((value) => {
  //             return { value: value.id, label: value.name }
  //           })
  //         }
  //       })
  //       setAttributes(mappedData)
  //       console.log(mappedData);
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   }



    const getBrands = async () => {
      try {
        const res = await axiosPrivate.get('/brands/');
        const mappedData = res.data.map((brand) => {
          return { value: brand.id, label: brand.name }
        })
        setBrands(mappedData)
      } catch (error) {
        console.log(error)
      }
    }



    getBrands();
    // getAttributes();
    getTypes()

  }, [])

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await axiosPrivate.get('/products/' + productId);
        setProduct(res.data)
        setValues(res.data)

        var selectedAttributes = res.data.attributes.reduce(
          (obj, item) => Object.assign(obj, { [item.attributeName]: item.attributeValueId }), {});

        setSelectedAttributes(selectedAttributes)
        console.log('hiiiii');
        await getTypes()
        console.log(types)
        setSelectedType(types?.find(type => type.value == res.data.typeId));

      } catch (error) {
        console.log(error)
      }
    }

    if (productId) {
      getProduct();
    }
  }, [types])




  console.log(errors);

  const handleChangeType = (e) => {
    setSelectedType(types.find(type => type.value == e.target.value));
    console.log('changed')
    console.log(types);
    values.typeId = e.target.value
  }

  const handleChangeAttribute = (e) => {
    const { value, name } = e.target
    setSelectedAttributes(prev => {
      return {
        ...prev,
        [name]: value
      }
    })

    console.log(selectedAttributes);
  }

  return (
    <div>
      <div className={ProductCSS.headerContainer}>
        <PageHeader category="Products" title={productId ? 'Update Product' : 'Ceate Product'} />
        {productId &&
          <Button
            onClick={() => { navigate('/product/' + productId) }}
            className='btn btn-primary btn-md'
          >
            Show In Shop
          </Button>
        }

      </div>

      <form onSubmit={handleSubmit}>
        <div className={ProductCSS.formContainer}>
          {/* image select */}
          <div className={ProductCSS.imageSelectContainer}>
            <div className={ProductCSS.thumbContainer}>
              {values?.images?.map((image) => {
                return (
                  <div className={ProductCSS.thumb} key={image.url}>
                    <img key={image.url} src={image.url} onClick={() => setSelectedImage(image)} />
                  </div>
                )

              })}
            </div>
            <div className={ProductCSS.imagePreview}>
              <img
                src={
                  values.image
                    ? values.image
                    : ImageHolder
                }
                alt="picture-placeholder"
              />
              {uploading ? <Loader color='000' /> : ''}
            </div >
            <label className={ProductCSS.imageSelectLabel} htmlFor="file">
              Select an Image <MdDriveFolderUpload />
            </label>
            <input
              style={{ display: 'none' }}
              type="file"
              ref={inputFileRef}
              id='file'
              onChange={uploadImageHandler}
            />
            <span className={errors.image ? "flex items-center instructions" : "flex items-center offscreen"}>
              <FaInfoCircle /> {errors.image}
            </span>
          </div>

          <div className={ProductCSS.formInput}>
            <InputSelect
              onChange={handleChange}
              name='brandId'
              value={values.brandId}
              defaultValue={0}
              options={brands}
              label='Select Brand'
              error={errors.brandId}
            />
          </div>

          <div className={ProductCSS.formInput}>
            <InputSelect
              onChange={handleChange}
              name='categoryId'
              value={values.categoryId}
              defaultValue={0}
              label='Select Category'
              options={[
                { value: '1', label: 'Outdoor Led Displayes' },
                { value: '2', label: 'Indoor Led Displayes' },
                { value: '3', label: 'Controllers' },
              ]}
              error={errors.categoryId}
            />
          </div>

          <div className={ProductCSS.formInput}>
            <Input
              name="name"
              label="Model Name"
              type='text'
              placeholder="Name"
              value={values.name}
              onChange={handleChange}
              // pattern="^"
              required={true}
              error={errors.name}
            />
          </div>

          <div className={ProductCSS.formInput}>
            <Input
              name="pixelPitch"
              label="Pixel Pitch"
              type='text'
              placeholder="Pixel Pitch"
              value={values.pixelPitch}
              onChange={handleChange}
              // pattern="^"
              required={true}
              error={errors.pixelPitch}
            />
          </div>

          <div className={ProductCSS.formInput}>
            <Input
              name="moduleSize"
              label="Module Size"
              type='text'
              placeholder="Module Size"
              value={values.moduleSize}
              onChange={handleChange}
              required={true}
              error={errors.moduleSize}
            />
          </div>

          <div className={ProductCSS.formInput}>
            <Input
              name="cabinetSize"
              label="Cabinet Size"
              type='text'
              placeholder="Cabinet Size"
              value={values.cabinetSize}
              onChange={handleChange}
              required={true}
              error={errors.cabinetSize}
            />
          </div>

          {/* <div className={ProductCSS.formInput}>
            <Input
              name="description"
              label="Description"
              type='text'
              placeholder="Description"
              value={values.description}
              onChange={handleChange}
              required={true}
              error={errors.description}
            />
          </div> */}

          {/* <div className={ProductCSS.formInput}>
            <InputSelect
              onChange={handleChangeType}
              name='typeId'
              value={values.typeId}
              defaultValue={0}
              options={types}
              label='Select Type'
              error={errors.typeId}
            />
          </div> */}
          {/* {types && selectedType && selectedType.attributes?.map((attribute, i) => {
            return (
              <div className={ProductCSS.formInput} key={i}>
                <InputSelect
                  onChange={handleChangeAttribute}
                  name={attribute.label}
                  value={selectedAttributes[attribute.label]}
                  defaultValue={0}
                  options={attribute.values}
                  label={`Select ${attribute.label}`}
                  error={errors.brandId}
                />
              </div>
            )
          })} */}
        </div>



        <LoadingButton
          onClick={(e) => { }}
          className='btn btn-primary btn-md'
          disabledOnLoading={true}
          disabled={!isValid}
          loading={isSubmitting || uploading}
        >
          {productId ? 'Update' : 'Ceate'}
        </LoadingButton>
      </form>
    </div>
  )
}

export default ProductEdit