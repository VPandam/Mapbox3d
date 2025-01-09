import { useRef, useEffect, useState } from "react"
import mapboxgl from "mapbox-gl"
import * as THREE from "three"
import "mapbox-gl/dist/mapbox-gl.css"

import "./App.css"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader" // Importación correctafunction App() {
const App = () => {
  const mapRef = useRef()
  const mapContainerRef = useRef()
  const [isClicking, setIsClicking] = useState(false)
  const [selectedObject, setSelectedObject] = useState(null)
  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoicGFuZGFtMzMzIiwiYSI6ImNtM3I4bWFlbzAyYmsycXMxczBrY21ncmQifQ.8ZH7LUdwLMvy3pxGjFGktA"
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      zoom: 18,
      center: [148.9819, -35.3981],
      pitch: 60,
      antialias: true,
    })
    const modelOrigin = [148.9819, -35.39847]

    //0
    const modelAltitude = 0

    //ST Esteve
    // const modelAltitude = -260
    //Carto
    const modelRotate = [Math.PI / 2, 0, 0]

    //ST Esteve
    // const modelRotate = [Math.PI / 0.5, 0, 0]

    const modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
      modelOrigin,
      modelAltitude
    )

    const modelTransform = {
      translateX: modelAsMercatorCoordinate.x,
      translateY: modelAsMercatorCoordinate.y,
      translateZ: modelAsMercatorCoordinate.z,
      rotateX: modelRotate[0],
      rotateY: modelRotate[1],
      rotateZ: modelRotate[2],
      scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits(),
    }

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.z = 5

    const scene = new THREE.Scene()

    // Crear un material para el marcador
    const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })

    // Crear un material para visualizar el rayo
    const rayMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 })

    // Crear un objeto de línea para visualizar el rayo
    const rayGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -10),
    ])
    const rayLine = new THREE.Line(rayGeometry, rayMaterial)
    scene.add(rayLine)

    const createCustomLayer = (map) => {
      const directionalLight1 = new THREE.DirectionalLight(0xffffff)
      directionalLight1.position.set(0, -70, 100).normalize()
      scene.add(directionalLight1)

      const directionalLight2 = new THREE.DirectionalLight(0xffffff)
      directionalLight2.position.set(0, 70, 100).normalize()
      scene.add(directionalLight2)

      const models = []
      const loader = new GLTFLoader()
      loader.load("../public/LorientBuildings.glb", (gltf) => {
        // loader.load("../public/StEsteve_Lod2_v0.0.1.glb", (gltf) => {
        const model = gltf.scene
        console.log("model: ", model)
        // Iterar sobre los objetos del modelo
        model.traverse((child) => {
          const model1 = gltf.scene
          model1.position.set(0, 0, 0) // Colocar el modelo en una posición

          if (child.isMesh) {
            if (!child.material) {
              child.material = new THREE.MeshStandardMaterial({
                color: 0x00ff00,
              })
            }
            child.material.visible = true // Asegúrate de que el material es visible
            // child.name = "Building" // Asignar un nombre para que se pueda identificar más tarde
          }
          console.log("child: ", child.name)
          if (child.isMesh && child.name == "Collective") {
            console.log("entra")
            // Verifica si el objeto es un Mesh (un edificio o parte del modelo)
            // Cambiar el color del material del edificio
            // Cambiar por el nombre del edificio específico
            // Clonamos el material antes de cambiarlo
            const newMaterial = child.material.clone()
            newMaterial.color.set("#ff0000") // Cambiar el color del edificio a rojo
            child.material = newMaterial // Aplicar el nuevo material clonado
          }
          scene.add(model1)
          models.push(model1)
        })

        scene.add(gltf.scene)
      })
      // loader.load("../public/LorientSchema.glb", (gltf) => {
      //   const model = gltf.scene
      //   // Iterar sobre los objetos del modelo
      //   model.traverse((child) => {
      //     const model1 = gltf.scene

      //     if (child.isMesh) {
      //       if (!child.material) {
      //         child.material = new THREE.MeshStandardMaterial({
      //           color: 0x00ff00,
      //         })
      //       }
      //       child.material.visible = true // Asegúrate de que el material es visible
      //       // child.name = "Building" // Asignar un nombre para que se pueda identificar más tarde
      //     }
      //     console.log("child: ", child.name)
      //     if (child.isMesh && child.name == "Collective") {
      //       console.log("entra")
      //       // Verifica si el objeto es un Mesh (un edificio o parte del modelo)
      //       // Cambiar el color del material del edificio
      //       // Cambiar por el nombre del edificio específico
      //       // Clonamos el material antes de cambiarlo
      //       const newMaterial = child.material.clone()
      //       newMaterial.color.set("#ff0000") // Cambiar el color del edificio a rojo
      //       child.material = newMaterial // Aplicar el nuevo material clonado
      //     }
      //     model1.position.set(1, 2, 2) // Colocar el modelo en una posición

      //     scene.add(model1)

      //     models.push(model1)
      //   })

      //   scene.add(gltf.scene)
      // })
      // loader.load("../public/LorientBackGround.glb", (gltf) => {
      //   const model = gltf.scene
      //   // Iterar sobre los objetos del modelo
      //   model.traverse((child) => {
      //     const model1 = gltf.scene
      //     model1.position.set(0, 0, 0) // Colocar el modelo en una posición

      //     if (child.isMesh) {
      //       if (!child.material) {
      //         child.material = new THREE.MeshStandardMaterial({
      //           color: 0x00ff00,
      //         })
      //       }
      //       child.material.visible = true // Asegúrate de que el material es visible
      //       // child.name = "Building" // Asignar un nombre para que se pueda identificar más tarde
      //     }
      //     console.log("child: ", child.name)
      //     if (child.isMesh && child.name == "Collective") {
      //       console.log("entra")
      //       // Verifica si el objeto es un Mesh (un edificio o parte del modelo)
      //       // Cambiar el color del material del edificio
      //       // Cambiar por el nombre del edificio específico
      //       // Clonamos el material antes de cambiarlo
      //       const newMaterial = child.material.clone()
      //       newMaterial.color.set("#ff0000") // Cambiar el color del edificio a rojo
      //       child.material = newMaterial // Aplicar el nuevo material clonado
      //     }
      //     scene.add(model1)
      //     models.push(model1)
      //   })

      //   scene.add(gltf.scene)
      // })

      const renderer = new THREE.WebGLRenderer({
        canvas: map.getCanvas(),
        context: map.painter.context.gl,
        antialias: true,
      })

      renderer.autoClear = false

      return {
        id: "3d-model",
        type: "custom",
        renderingMode: "3d",
        onAdd: () => {
          // Add logic that runs on layer addition if necessary.
        },
        render: (gl, matrix) => {
          const rotationX = new THREE.Matrix4().makeRotationAxis(
            new THREE.Vector3(1, 0, 0),
            modelTransform.rotateX
          )
          const rotationY = new THREE.Matrix4().makeRotationAxis(
            new THREE.Vector3(0, 1, 0),
            modelTransform.rotateY
          )
          const rotationZ = new THREE.Matrix4().makeRotationAxis(
            new THREE.Vector3(0, 0, 1),
            modelTransform.rotateZ
          )

          const m = new THREE.Matrix4().fromArray(matrix)
          const l = new THREE.Matrix4()
            .makeTranslation(
              modelTransform.translateX,
              modelTransform.translateY,
              modelTransform.translateZ
            )
            .scale(
              new THREE.Vector3(
                modelTransform.scale,
                -modelTransform.scale,
                modelTransform.scale
              )
            )
            .multiply(rotationX)
            .multiply(rotationY)
            .multiply(rotationZ)

          camera.projectionMatrix = m.multiply(l)
          renderer.resetState()
          renderer.render(scene, camera)
          map.triggerRepaint()
        },
      }
    }

    map.on("style.load", () => {
      const customLayer = createCustomLayer(map)
      map.addLayer(customLayer, "waterway-label")
    })

    mapRef.current = map
    // Crear el raycaster y el vector del ratón
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    // Variables para detectar el clic
    const onMouseClick = (event) => {
      if (isClicking) return // Evita la ejecución repetida de clics
      // Convertir las coordenadas del mouse a coordenadas normalizadas (-1 a 1)
      setIsClicking(true)
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
      console.log(event)
      // Actualizar el rayo con la cámara y el mouse
      raycaster.setFromCamera(mouse, camera)

      // Visualizar el rayo (actualizamos la línea para que apunte a donde está el rayo)
      const dir = raycaster.ray.direction.clone().multiplyScalar(10) // Prolongar el rayo
      rayLine.geometry.setFromPoints([
        raycaster.ray.origin,
        raycaster.ray.origin.clone().add(dir),
      ])
      // Detectar la intersección con los objetos de la escena
      const intersects = raycaster.intersectObjects(scene.children, true)
      console.log("intersect: ", intersects)
      if (intersects.length > 0) {
        // Si se ha detectado una intersección, cambiar el color
        const object = intersects[0].object
        console.log("objClicked: ", object)
        // Cambiar el color del objeto seleccionado
        object.name == "testName"

        const newMaterial = object.material.clone()
        newMaterial.color.set("#ff0000") // Cambiar el color del edificio a rojo
        console.log("newMat: ", newMaterial)
        newMaterial.name = "TestMat"
        object.material = newMaterial // Aplicar el nuevo material clonado
        object.material.needsUpdate = true // Marca el material como necesitando ser actualizado
        object.scale.set(2, 2, 2)
        object.matrixWorldNeedsUpdate = true
         // object.material.color.set(Math.random() * 0xffffff) // Cambiar a un color aleatorio
        if (selectedObject !== object) {
          setSelectedObject(object)
        }
      }
      // Restablecer la variable de clic después de un corto período
      setTimeout(() => {
        setIsClicking(false)
      }, 200)
    }

    // Añadir el evento de clic
    window.addEventListener("click", onMouseClick)
    return () => map.remove()
  }, [])

  useEffect(() => {
    console.log("selectedObjectChanged: ", selectedObject)
  }, [selectedObject])
  return (
    <div ref={mapContainerRef} style={{ height: "100%", width: "100%" }}></div>
  )
}

export default App
