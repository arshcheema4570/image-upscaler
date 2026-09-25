"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __decorateClass = (decorators, target, key, kind) => {
    var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
    for (var i5 = decorators.length - 1, decorator; i5 >= 0; i5--)
      if (decorator = decorators[i5])
        result = (kind ? decorator(target, key, result) : decorator(result)) || result;
    if (kind && result) __defProp(target, key, result);
    return result;
  };
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // ../../packages/wasm_utils/dist/index.js
  async function runScript(scriptUrl) {
    if (typeof importScripts === "function") {
      importScripts(scriptUrl.toString());
    } else {
      const script = document.createElement("script");
      script.src = scriptUrl.toString();
      script.crossOrigin = "anonymous";
      return new Promise((resolve, revoke) => {
        script.addEventListener("load", () => {
          resolve();
        }, false);
        script.addEventListener("error", (e5) => {
          revoke(e5);
        }, false);
        document.body.appendChild(script);
      });
    }
  }
  var createWasmLib = async (constructorFcn, wasmLoaderScript, assetLoaderScript, glCanvas, fileLocator) => {
    if (wasmLoaderScript) {
      await runScript(wasmLoaderScript);
    }
    if (!self.ModuleFactory) {
      throw new Error("ModuleFactory not set.");
    }
    if (assetLoaderScript) {
      await runScript(assetLoaderScript);
      if (!self.ModuleFactory) {
        throw new Error("ModuleFactory not set.");
      }
    }
    if (self.Module && fileLocator) {
      const moduleFileLocator = self.Module;
      moduleFileLocator.locateFile = fileLocator.locateFile;
      if (fileLocator.mainScriptUrlOrBlob) {
        moduleFileLocator.mainScriptUrlOrBlob = fileLocator.mainScriptUrlOrBlob;
      }
    }
    const module = await self.ModuleFactory(self.Module || fileLocator);
    self.ModuleFactory = self.Module = void 0;
    return new constructorFcn(module, glCanvas);
  };

  // node_modules/@litertjs/core/dist/index.js
  var ElementType = {
    NONE: 0,
    FLOAT32: 1,
    INT32: 2,
    UINT8: 3,
    INT64: 4,
    STRING: 5,
    BOOL: 6,
    INT16: 7,
    COMPLEX64: 8,
    INT8: 9,
    FLOAT16: 10,
    FLOAT64: 11,
    COMPLEX128: 12,
    UINT64: 13,
    RESOURCE: 14,
    VARIANT: 15,
    UINT32: 16,
    UINT16: 17,
    INT4: 18,
    BFLOAT16: 19
  };
  var ElementTypeName = {
    [ElementType.NONE]: "NONE",
    [ElementType.FLOAT32]: "FLOAT32",
    [ElementType.INT32]: "INT32",
    [ElementType.UINT8]: "UINT8",
    [ElementType.INT64]: "INT64",
    [ElementType.STRING]: "STRING",
    [ElementType.BOOL]: "BOOL",
    [ElementType.INT16]: "INT16",
    [ElementType.COMPLEX64]: "COMPLEX64",
    [ElementType.INT8]: "INT8",
    [ElementType.FLOAT16]: "FLOAT16",
    [ElementType.FLOAT64]: "FLOAT64",
    [ElementType.COMPLEX128]: "COMPLEX128",
    [ElementType.UINT64]: "UINT64",
    [ElementType.RESOURCE]: "RESOURCE",
    [ElementType.VARIANT]: "VARIANT",
    [ElementType.UINT32]: "UINT32",
    [ElementType.UINT16]: "UINT16",
    [ElementType.INT4]: "INT4",
    [ElementType.BFLOAT16]: "BFLOAT16"
  };
  var TensorBufferType = {
    HOST_MEMORY: 1,
    WEB_GPU_BUFFER: 20,
    WEB_GPU_BUFFER_FP16: 21,
    WEB_GPU_BUFFER_PACKED: 26
  };
  var TensorBufferTypeName = {
    [TensorBufferType.HOST_MEMORY]: "HOST_MEMORY",
    [TensorBufferType.WEB_GPU_BUFFER]: "WEB_GPU_BUFFER",
    [TensorBufferType.WEB_GPU_BUFFER_FP16]: "WEB_GPU_BUFFER_FP16",
    [TensorBufferType.WEB_GPU_BUFFER_PACKED]: "WEB_GPU_BUFFER_PACKED"
  };
  var DATATYPES = Object.freeze([
    {
      dtype: "float32",
      typedArrayConstructor: Float32Array,
      elementType: ElementType.FLOAT32
    },
    {
      dtype: "int32",
      typedArrayConstructor: Int32Array,
      elementType: ElementType.INT32
    },
    {
      dtype: "uint8",
      typedArrayConstructor: Uint8Array,
      elementType: ElementType.UINT8
    }
  ]);
  function getDataType(val) {
    for (const dataTypeMapping of DATATYPES) {
      if (dataTypeMapping.dtype === val || dataTypeMapping.typedArrayConstructor === val || val instanceof dataTypeMapping.typedArrayConstructor || dataTypeMapping.elementType === val) {
        return dataTypeMapping;
      }
    }
    if (typeof val === "string") {
      throw new Error(`DType ${val} is not supported.`);
    } else if (val instanceof Object) {
      throw new Error(`Typed array ${"name" in val ? val.name : val.constructor.name} is not supported.`);
    } else {
      throw new Error(
        `Element type ${ElementTypeName[val] ?? val} is not supported.`
      );
    }
  }
  var LiteRtNotLoadedError = class extends Error {
    constructor() {
      super(
        "LiteRT is not initialized yet. Please call loadLiteRt() and wait for its promise to resolve to load the LiteRT WASM module."
      );
    }
  };
  var globalLiteRt = void 0;
  var globalLiteRtPromise = void 0;
  function getGlobalLiteRt() {
    if (!globalLiteRt) {
      throw new LiteRtNotLoadedError();
    }
    return globalLiteRt;
  }
  function setGlobalLiteRt(liteRt) {
    globalLiteRt = liteRt;
  }
  function getGlobalLiteRtPromise() {
    return globalLiteRtPromise;
  }
  function hasGlobalLiteRtPromise() {
    return Boolean(globalLiteRtPromise);
  }
  function setGlobalLiteRtPromise(promise) {
    globalLiteRtPromise = promise;
  }
  var AcceleratorDefaultTensorBufferType = {
    "webgpu": TensorBufferType.WEB_GPU_BUFFER_PACKED,
    "wasm": TensorBufferType.HOST_MEMORY
  };
  var TensorBufferTypeToAccelerator = {
    [TensorBufferType.HOST_MEMORY]: "wasm",
    [TensorBufferType.WEB_GPU_BUFFER]: "webgpu",
    [TensorBufferType.WEB_GPU_BUFFER_FP16]: "webgpu",
    [TensorBufferType.WEB_GPU_BUFFER_PACKED]: "webgpu"
  };
  var DESIRED_WEBGPU_FEATURES = [
    "shader-f16",
    "subgroups"
  ];
  var Environment = class _Environment {
    constructor(options) {
      __publicField(this, "liteRtEnvironment");
      this.options = options;
      this.liteRtEnvironment = getGlobalLiteRt().liteRtWasm.LiteRtEnvironment.create(
        options.webGpuDevice
      );
    }
    static async create(options = {}) {
      let webGpuDevice = null;
      if ("webGpuDevice" in options) {
        if (options.webGpuDevice) {
          webGpuDevice = options.webGpuDevice;
        }
      } else {
        try {
          webGpuDevice = await createDefaultWebGpuDevice();
        } catch (e5) {
          console.warn("Failed to create default WebGPU device:", e5);
        }
      }
      return new _Environment({
        ...options,
        webGpuDevice
      });
    }
    get webGpuDevice() {
      return this.options.webGpuDevice;
    }
    delete() {
      this.liteRtEnvironment.delete();
    }
  };
  async function createDefaultWebGpuDevice() {
    const adapterDescriptor = {
      powerPreference: "high-performance"
    };
    const adapter = await navigator.gpu.requestAdapter(adapterDescriptor);
    if (!adapter) {
      throw new Error("No GPU adapter found.");
    }
    const requiredLimits = {
      maxBufferSize: adapter.limits.maxBufferSize,
      maxStorageBufferBindingSize: adapter.limits.maxStorageBufferBindingSize,
      maxStorageBuffersPerShaderStage: adapter.limits.maxStorageBuffersPerShaderStage,
      maxTextureDimension2D: adapter.limits.maxTextureDimension2D
    };
    const requiredFeatures = [];
    for (const feature of DESIRED_WEBGPU_FEATURES) {
      if (adapter.features.has(feature)) {
        requiredFeatures.push(feature);
      }
    }
    return await adapter.requestDevice({
      requiredFeatures,
      requiredLimits
    });
  }
  function emscriptenVectorToArray(vector) {
    const array = new Array(vector.size());
    for (let i5 = 0; i5 < vector.size(); ++i5) {
      array[i5] = vector.get(i5);
    }
    vector.delete();
    return array;
  }
  function fillEmscriptenVector(data, vector) {
    for (const item of data) {
      vector.push_back(item);
    }
  }
  function parseData(remainingArgs) {
    const data = remainingArgs.shift();
    const liteRtWasm = getGlobalLiteRt().liteRtWasm;
    if (data instanceof liteRtWasm.LiteRtTensorBuffer) {
      return { liteRtTensorBuffer: data };
    } else if (ArrayBuffer.isView(data)) {
      return { typedArray: data };
    } else if (data instanceof GPUBuffer) {
      return { gpuBuffer: data };
    } else {
      throw new Error(
        `Unknown type (${data?.constructor.name ?? data}) provided to create a Tensor`
      );
    }
  }
  function parseShape(remainingArgs) {
    if (Array.isArray(remainingArgs[0]) || remainingArgs[0] instanceof Int32Array) {
      return { shape: remainingArgs.shift() };
    } else {
      return {};
    }
  }
  function shiftUntilDefined(remainingArgs) {
    while (remainingArgs.length > 0 && remainingArgs[0] === void 0) {
      remainingArgs.shift();
    }
  }
  function parseDataType(remainingArgs) {
    shiftUntilDefined(remainingArgs);
    if (typeof remainingArgs[0] === "string") {
      const dtype = remainingArgs.shift();
      return { dataType: getDataType(dtype).dtype };
    } else {
      return {};
    }
  }
  function parseEnvironment(remainingArgs) {
    shiftUntilDefined(remainingArgs);
    if (remainingArgs[0] instanceof Environment) {
      return { environment: remainingArgs.shift() };
    } else {
      return {};
    }
  }
  function parseOnDelete(remainingArgs) {
    shiftUntilDefined(remainingArgs);
    if (remainingArgs[0] instanceof Function) {
      return { onDelete: remainingArgs.shift() };
    } else {
      return {};
    }
  }
  function parseArgs(args) {
    return {
      ...parseData(args),
      ...parseShape(args),
      ...parseDataType(args),
      ...parseEnvironment(args),
      ...parseOnDelete(args)
    };
  }
  var _a;
  var Tensor = (_a = class {
    constructor(a3, b3, c4, d3, e5) {
      __publicField(this, "liteRtTensorBuffer");
      __publicField(this, "type");
      __publicField(this, "environment");
      __publicField(this, "deletedInternal", false);
      __publicField(this, "onDelete");
      const {
        typedArray,
        gpuBuffer,
        liteRtTensorBuffer,
        shape,
        dataType,
        environment,
        onDelete
      } = parseArgs([a3, b3, c4, d3, e5]);
      this.onDelete = onDelete;
      this.environment = environment ?? getGlobalLiteRt().getDefaultEnvironment();
      if (liteRtTensorBuffer) {
        if (shape) {
          throw new Error(
            "A LiteRtTensorBuffer cannot be provided with a shape."
          );
        }
        if (dataType) {
          throw new Error(
            "A LiteRtTensorBuffer cannot be provided with a data type."
          );
        }
        this.liteRtTensorBuffer = liteRtTensorBuffer;
      } else if (gpuBuffer) {
        if (!shape) {
          throw new Error("A GPUBuffer must be provided with a shape.");
        }
        if (!dataType) {
          throw new Error("A GPUBuffer must be provided with a data type.");
        }
        const [liteRtTensorBuffer2, webGpuBufferPtr] = webGpuBufferToLiteRtTensorBuffer(
          gpuBuffer,
          shape,
          dataType,
          this.environment
        );
        this.liteRtTensorBuffer = liteRtTensorBuffer2;
        const onDelete2 = this.onDelete;
        this.onDelete = () => {
          const liteRtWasm = getGlobalLiteRt().liteRtWasm;
          liteRtWasm.wgpuBufferRelease(webGpuBufferPtr);
          onDelete2?.();
        };
      } else if (typedArray) {
        this.liteRtTensorBuffer = typedArrayToLiteRtTensorBuffer(
          typedArray,
          shape,
          environment
        );
      } else {
        throw new Error("No data provided to create a Tensor.");
      }
      this.type = liteRtTensorBufferToTensorType(this.liteRtTensorBuffer);
    }
    static fromTypedArray(data, shape, environment) {
      return new _a(data, shape, environment);
    }
    ensureNotDeleted() {
      if (this.deleted) {
        throw new Error("Tensor is deleted and cannot be used.");
      }
    }
    async data() {
      this.ensureNotDeleted();
      if (this.liteRtTensorBuffer.bufferType().value === TensorBufferType.HOST_MEMORY) {
        return this.toTypedArray();
      }
      const copy = await this.copyTo("wasm");
      const data = await copy.data();
      copy.delete();
      return data;
    }
    toTypedArray() {
      this.ensureNotDeleted();
      const liteRtWasm = getGlobalLiteRt().liteRtWasm;
      if (this.liteRtTensorBuffer.isWebGpuMemory()) {
        throw new Error(
          "Cannot convert a Tensor with WebGPU memory to a TypedArray."
        );
      }
      if (this.liteRtTensorBuffer.bufferType().value !== liteRtWasm.LiteRtTensorBufferType.HOST_MEMORY.value) {
        throw new Error(
          "Cannot convert a Tensor with non-host memory to a TypedArray."
        );
      }
      if (this.liteRtTensorBuffer.size() !== this.liteRtTensorBuffer.packedSize() || this.liteRtTensorBuffer.offset() !== 0) {
        throw new Error("Tensors with strides or padding are not yet supported.");
      }
      const rankedTensorType = this.liteRtTensorBuffer.tensorType();
      const elementType = rankedTensorType.elementType();
      const byteWidth = liteRtWasm.liteRtGetByteWidth(elementType);
      rankedTensorType.delete();
      const typedArrayConstructor = getDataType(
        elementType.value
      ).typedArrayConstructor;
      if (typedArrayConstructor.BYTES_PER_ELEMENT !== byteWidth) {
        throw new Error(
          `Byte width ${byteWidth} of the tensor's element type ${ElementTypeName[elementType.value]} does not match the expected byte width ${typedArrayConstructor.BYTES_PER_ELEMENT} of the ${typedArrayConstructor.name}.`
        );
      }
      const dataPtr = this.liteRtTensorBuffer.lock(
        getGlobalLiteRt().liteRtWasm.LiteRtTensorBufferLockMode.READ
      );
      try {
        const uint8Array = liteRtWasm.HEAPU8.slice(
          dataPtr,
          dataPtr + this.liteRtTensorBuffer.packedSize()
        );
        const typedArray = new typedArrayConstructor(
          uint8Array.buffer,
          uint8Array.byteOffset,
          uint8Array.byteLength / byteWidth
        );
        return typedArray;
      } finally {
        this.liteRtTensorBuffer.unlock();
      }
    }
    getBufferType() {
      this.ensureNotDeleted();
      return this.liteRtTensorBuffer.bufferType().value;
    }
    /**
     * Returns the underlying GPUBuffer of the Tensor.
     *
     * Note that the lifetime of the returned GPUBuffer is dependant upon how the
     * Tensor was created. If the Tensor was constructed from a GPUBuffer, then
     * the GPUBuffer will NOT be released when the Tensor is deleted. If the
     * Tensor was copied/moved to GPU from host memory, then the GPU buffer will
     * be released when the Tensor is deleted.
     *
     * The GPU buffer may be larger than the actual data in the tensor.
     *
     * @return The GPUBuffer containing the Tensor's data.
     */
    toGpuBuffer() {
      this.ensureNotDeleted();
      const liteRtWasm = getGlobalLiteRt().liteRtWasm;
      if (!this.liteRtTensorBuffer.isWebGpuMemory()) {
        throw new Error(
          "Cannot convert a Tensor with non-WebGPU memory to a GPUBuffer."
        );
      }
      const bufferTypeValue = this.liteRtTensorBuffer.bufferType().value;
      if (bufferTypeValue !== liteRtWasm.LiteRtTensorBufferType.WEB_GPU_BUFFER.value && bufferTypeValue !== liteRtWasm.LiteRtTensorBufferType.WEB_GPU_BUFFER_FP16.value && bufferTypeValue !== liteRtWasm.LiteRtTensorBufferType.WEB_GPU_BUFFER_PACKED.value) {
        throw new Error(
          "Cannot convert a Tensor with host memory to a GPUBuffer."
        );
      }
      if (this.liteRtTensorBuffer.size() !== this.liteRtTensorBuffer.packedSize() || this.liteRtTensorBuffer.offset() !== 0) {
        throw new Error("Tensors with strides or padding are not yet supported.");
      }
      const gpuBufferId = this.liteRtTensorBuffer.getWebGpuBuffer();
      return liteRtWasm.WebGPU.getJsObject(gpuBufferId);
    }
    getCopyFunctionSet(destination) {
      this.ensureNotDeleted();
      const sourceBufferType = this.getBufferType();
      const copyFunctions = _a.copyFunctions.get(sourceBufferType);
      if (!copyFunctions) {
        throw new Error(
          `TensorBufferType ${TensorBufferTypeName[sourceBufferType] ?? sourceBufferType} does not support copying or moving`
        );
      }
      const destinationBufferType = typeof destination === "string" ? AcceleratorDefaultTensorBufferType[destination] : destination;
      if (destinationBufferType == null) {
        throw new Error(
          `Unknown destination '${destination}' for copying or moving.`
        );
      }
      const copyFunctionSet = copyFunctions.get(destinationBufferType);
      if (!copyFunctionSet) {
        const supportedDestinations = [...copyFunctions].map(
          ([key]) => TensorBufferTypeName[key] ?? key
        );
        throw new Error(
          `TensorBufferType ${TensorBufferTypeName[sourceBufferType]} does not support copying or moving to ${TensorBufferTypeName[destinationBufferType]}. It supports the following TensorBufferTypes: [${supportedDestinations.join(
            ", "
          )}].`
        );
      }
      return [copyFunctionSet, destinationBufferType];
    }
    /**
     * Copies the tensor to the given accelerator.
     *
     * @param destination The accelerator or buffer type to copy to.
     * @return A promise that resolves to the copied tensor.
     */
    async copyTo(destination, options) {
      const [copyFunctionSet, destinationBufferType] = this.getCopyFunctionSet(destination);
      if (!copyFunctionSet.copyTo) {
        throw new Error(
          `Copying to ${TensorBufferTypeName[destinationBufferType]} is not supported by this tensor.`
        );
      }
      return copyFunctionSet.copyTo(this, options);
    }
    /**
     * Moves the tensor to the given accelerator.
     *
     * @param destination The accelerator or buffer type to move to.
     * @return A promise that resolves to the moved tensor.
     */
    async moveTo(destination, options) {
      const [copyFunctionSet, destinationBufferType] = this.getCopyFunctionSet(destination);
      if (!copyFunctionSet.moveTo) {
        throw new Error(
          `Moving to ${TensorBufferTypeName[destinationBufferType]} is not supported by this tensor.`
        );
      }
      return copyFunctionSet.moveTo(this, options);
    }
    get bufferType() {
      return this.liteRtTensorBuffer.bufferType().value;
    }
    get accelerator() {
      const accelerator = TensorBufferTypeToAccelerator[this.bufferType];
      if (accelerator === void 0) {
        throw new Error(
          `TensorBufferType ${TensorBufferTypeName[this.bufferType]} has an unknown accelerator type.`
        );
      }
      return accelerator;
    }
    get deleted() {
      return this.deletedInternal;
    }
    delete() {
      if (this.deletedInternal) {
        return;
      }
      this.deletedInternal = true;
      this.liteRtTensorBuffer.delete();
      this.onDelete?.();
    }
  }, __publicField(_a, "copyFunctions", /* @__PURE__ */ new Map()), _a);
  function liteRtTensorBufferToTensorType(liteRtTensorBuffer) {
    const liteRtRankedTensorType = liteRtTensorBuffer.tensorType();
    const elementType = liteRtRankedTensorType.elementType();
    const liteRtLayout = liteRtRankedTensorType.layout();
    const dimensions = liteRtLayout.dimensions();
    liteRtLayout.delete();
    liteRtRankedTensorType.delete();
    return {
      dtype: getDataType(elementType.value).dtype,
      layout: { dimensions: emscriptenVectorToArray(dimensions) }
    };
  }
  function webGpuBufferToLiteRtTensorBuffer(gpuBuffer, shape, dtype, environment) {
    const globalLiteRt2 = getGlobalLiteRt();
    const liteRtWasm = globalLiteRt2.liteRtWasm;
    const dimensionsVector = new liteRtWasm.VectorInt32();
    fillEmscriptenVector(shape, dimensionsVector);
    const layout = liteRtWasm.LiteRtLayout.create(dimensionsVector);
    dimensionsVector.delete();
    const rankedTensorType = liteRtWasm.LiteRtRankedTensorType.create(
      { value: getDataType(dtype).elementType },
      layout
    );
    layout.delete();
    const importedGpuBufferPtr = liteRtWasm.WebGPU.importJsBuffer(gpuBuffer);
    const liteRtTensorBuffer = liteRtWasm.LiteRtTensorBuffer.createFromWebGpuBuffer(
      environment.liteRtEnvironment,
      rankedTensorType,
      liteRtWasm.LiteRtTensorBufferType.WEB_GPU_BUFFER_PACKED,
      importedGpuBufferPtr,
      gpuBuffer.size
    );
    rankedTensorType.delete();
    return [liteRtTensorBuffer, importedGpuBufferPtr];
  }
  function typedArrayToLiteRtTensorBuffer(data, shape, environment) {
    const globalLiteRt2 = getGlobalLiteRt();
    const liteRtWasm = globalLiteRt2.liteRtWasm;
    environment = environment ?? globalLiteRt2.getDefaultEnvironment();
    const elementType = getDataType(data).elementType;
    const dimensionsVector = new liteRtWasm.VectorInt32();
    fillEmscriptenVector(shape ?? [data.length], dimensionsVector);
    const layout = liteRtWasm.LiteRtLayout.create(dimensionsVector);
    dimensionsVector.delete();
    const expectedNumElements = layout.numElements();
    if (data.length !== expectedNumElements) {
      layout.delete();
      throw new Error(
        `Number of elements ${data.length} of the provided TypedArray does not match the expected number of elements ${expectedNumElements}.`
      );
    }
    const rankedTensorType = liteRtWasm.LiteRtRankedTensorType.create(
      { value: elementType },
      layout
    );
    layout.delete();
    const arrayType = data.constructor;
    const bufferSize = arrayType.BYTES_PER_ELEMENT * data.length;
    const expectedBufferSize = rankedTensorType.bytes();
    if (bufferSize !== expectedBufferSize) {
      rankedTensorType.delete();
      throw new Error(
        `Byte length ${bufferSize} of the provided TypedArray does not match the expected buffer size ${expectedBufferSize}.`
      );
    }
    const liteRtTensorBuffer = liteRtWasm.LiteRtTensorBuffer.createManaged(
      environment.liteRtEnvironment,
      liteRtWasm.LiteRtTensorBufferType.HOST_MEMORY,
      rankedTensorType,
      bufferSize
    );
    rankedTensorType.delete();
    const dataPtr = liteRtTensorBuffer.lock(
      liteRtWasm.LiteRtTensorBufferLockMode.WRITE
    );
    try {
      const uint8Data = new Uint8Array(
        data.buffer,
        data.byteOffset,
        data.byteLength
      );
      liteRtWasm.HEAPU8.set(uint8Data, dataPtr);
    } finally {
      liteRtTensorBuffer.unlock();
    }
    return liteRtTensorBuffer;
  }
  var CompiledModelSignatureRunner = class {
    constructor(signatureIndex, liteRtModel, liteRtCompiledModel, options) {
      __publicField(this, "inputDetails");
      __publicField(this, "outputDetails");
      __publicField(this, "liteRtSimpleSignature");
      __publicField(this, "deletedInternal", false);
      this.signatureIndex = signatureIndex;
      this.liteRtModel = liteRtModel;
      this.liteRtCompiledModel = liteRtCompiledModel;
      this.options = options;
      this.liteRtSimpleSignature = liteRtModel.getSignature(signatureIndex);
      const inputNames = emscriptenVectorToArray(this.liteRtSimpleSignature.inputNames());
      const inputDetails = [];
      for (let i5 = 0; i5 < inputNames.length; i5++) {
        const name = inputNames[i5];
        const tensorType = liteRtModel.getInputTensorType(signatureIndex, i5);
        const requirements = liteRtCompiledModel.getInputBufferRequirements(signatureIndex, i5);
        inputDetails.push(makeTensorDetails(name, i5, tensorType, requirements));
      }
      this.inputDetails = Object.freeze(inputDetails);
      const outputNames = emscriptenVectorToArray(this.liteRtSimpleSignature.outputNames());
      const outputDetails = [];
      for (let i5 = 0; i5 < outputNames.length; i5++) {
        const name = outputNames[i5];
        const tensorType = liteRtModel.getOutputTensorType(signatureIndex, i5);
        const requirements = liteRtCompiledModel.getOutputBufferRequirements(signatureIndex, i5);
        outputDetails.push(makeTensorDetails(name, i5, tensorType, requirements));
      }
      this.outputDetails = Object.freeze(outputDetails);
    }
    /**
     * The string key corresponding to this signature in the model.
     */
    get key() {
      this.ensureNotDeleted();
      return this.liteRtSimpleSignature.key();
    }
    /**
     * Get details about each input tensor.
     */
    getInputDetails() {
      this.ensureNotDeleted();
      return this.inputDetails;
    }
    /**
     * Get details about each output tensor.
     */
    getOutputDetails() {
      this.ensureNotDeleted();
      return this.outputDetails;
    }
    async run(input) {
      this.ensureNotDeleted();
      const inputArray = this.inputsToArray(input);
      const { inputsOnAccelerator, cleanup } = await this.ensureInputsOnAccelerator(inputArray);
      let outputArray;
      try {
        outputArray = await this.runWithArray(inputsOnAccelerator);
      } finally {
        cleanup();
      }
      if (Array.isArray(input) || input instanceof Tensor) {
        return outputArray;
      } else {
        return this.outputsToRecord(outputArray);
      }
    }
    inputsToArray(input) {
      if (Array.isArray(input)) {
        if (input.length !== this.inputDetails.length) {
          throw new Error(
            `run() called with ${input.length} inputs, but signature expects ${this.inputDetails.length} inputs`
          );
        }
        return input;
      }
      if (input instanceof Tensor) {
        if (this.inputDetails.length !== 1) {
          throw new Error(
            `run() called with a single tensor, but signature expects ${this.inputDetails.length} inputs`
          );
        }
        return [input];
      }
      const inputArray = [];
      for (const inputDetails of this.inputDetails) {
        if (!(inputDetails.name in input)) {
          throw new Error(
            `run() called with input record that is missing input ${inputDetails.name} with index ${inputDetails.index}`
          );
        }
        inputArray.push(input[inputDetails.name]);
      }
      return inputArray;
    }
    outputsToRecord(output) {
      const outputRecord = {};
      for (let i5 = 0; i5 < this.outputDetails.length; i5++) {
        outputRecord[this.outputDetails[i5].name] = output[i5];
      }
      return outputRecord;
    }
    /**
     * Ensures that all input tensors are on the correct accelerator. Copies any
     * tensors that are not on the correct accelerator.
     *
     * @param inputs The input tensors to be passed to the signature. They must
     *     be in the same order and quantity as the input details.
     * @return A promise that resolves to a list of input tensors that are on the
     *     correct accelerator, and a cleanup function that deletes any tensors
     *     that were copied.
     */
    async ensureInputsOnAccelerator(inputs) {
      const toDelete = [];
      const inputsOnAccelerator = [];
      const inputDetails = this.getInputDetails();
      if (inputs.length !== inputDetails.length) {
        throw new Error(`ensureInputsOnAccelerator() called with ${inputs.length} inputs, but signature expects ${inputDetails.length} inputs`);
      }
      for (let i5 = 0; i5 < inputs.length; i5++) {
        const input = inputs[i5];
        const bufferType = input.getBufferType();
        const supportedBufferTypes = inputDetails[i5].supportedBufferTypes;
        if (supportedBufferTypes.size === 0) {
          throw new Error(`Tensor ${inputDetails[i5].name} with index ${inputDetails[i5].index} has no supported buffer types.`);
        }
        if (supportedBufferTypes.has(bufferType)) {
          inputsOnAccelerator.push(input);
        } else {
          const newBufferType = supportedBufferTypes.values().next().value;
          const copy = await input.copyTo(newBufferType);
          toDelete.push(copy);
          inputsOnAccelerator.push(copy);
        }
      }
      return {
        inputsOnAccelerator,
        cleanup: () => {
          for (const tensor of toDelete) {
            tensor.delete();
          }
        }
      };
    }
    async runWithArray(input) {
      for (let i5 = 0; i5 < input.length; i5++) {
        const inputTensor = input[i5];
        const expectedRankedTensorType = this.liteRtModel.getInputTensorType(this.signatureIndex, i5);
        const inputRequirements = this.liteRtCompiledModel.getInputBufferRequirements(
          this.signatureIndex,
          i5
        );
        getGlobalLiteRt().liteRtWasm.checkTensorBufferCompatible(
          inputTensor.liteRtTensorBuffer,
          expectedRankedTensorType,
          inputRequirements
        );
        expectedRankedTensorType.delete();
        inputRequirements.delete();
      }
      const outputTensorBuffers = await this.liteRtCompiledModel.run(
        this.signatureIndex,
        input.map((tensor) => tensor.liteRtTensorBuffer)
      );
      return outputTensorBuffers.map(
        (tensorBuffer) => new Tensor(tensorBuffer, this.options.environment)
      );
    }
    get deleted() {
      return this.deletedInternal;
    }
    ensureNotDeleted() {
      if (this.deleted) {
        throw new Error(
          "CompiledModelSignatureRunner is deleted and cannot be used."
        );
      }
    }
    delete() {
      if (this.deletedInternal) {
        return;
      }
      this.deletedInternal = true;
      this.liteRtSimpleSignature.delete();
    }
  };
  function makeTensorDetails(name, index, tensorType, requirements) {
    const layout = tensorType.layout();
    const dimensions = emscriptenVectorToArray(layout.dimensions());
    layout.delete();
    const supportedBufferTypes = new Set(emscriptenVectorToArray(requirements.supportedTypes()).map(({ value }) => value));
    const details = {
      name,
      index,
      dtype: getDataType(tensorType.elementType().value).dtype,
      shape: new Int32Array(dimensions),
      supportedBufferTypes
    };
    tensorType.delete();
    requirements.delete();
    return details;
  }
  var CompiledModel = class {
    constructor(model, liteRtCompiledModel, options, onDelete) {
      __publicField(this, "defaultSignature");
      __publicField(this, "compiledModelSignatureRunners");
      __publicField(this, "key");
      __publicField(this, "deletedInternal", false);
      this.model = model;
      this.liteRtCompiledModel = liteRtCompiledModel;
      this.options = options;
      this.onDelete = onDelete;
      const numSignatures = model.liteRtModel.getNumSignatures();
      const compiledModelSignatureRunners = {};
      for (let i5 = 0; i5 < numSignatures; i5++) {
        const compiledModelSignatureRunner = new CompiledModelSignatureRunner(
          i5,
          model.liteRtModel,
          liteRtCompiledModel,
          options
        );
        compiledModelSignatureRunners[compiledModelSignatureRunner.key] = compiledModelSignatureRunner;
      }
      this.compiledModelSignatureRunners = Object.freeze(compiledModelSignatureRunners);
      this.defaultSignature = Object.values(this.signatures)[0];
      this.key = this.defaultSignature.key;
    }
    get signatures() {
      this.ensureNotDeleted();
      return this.compiledModelSignatureRunners;
    }
    getInputDetails() {
      this.ensureNotDeleted();
      return this.defaultSignature.getInputDetails();
    }
    getOutputDetails() {
      this.ensureNotDeleted();
      return this.defaultSignature.getOutputDetails();
    }
    async run(inputOrSignatureName, maybeInput) {
      this.ensureNotDeleted();
      const [signature, input] = this.parseRunInputs(inputOrSignatureName, maybeInput);
      return await signature.run(input);
    }
    parseRunInputs(inputOrSignatureName, maybeInput) {
      let signature;
      let input;
      if (typeof inputOrSignatureName === "string") {
        signature = this.signatures[inputOrSignatureName];
        if (!signature) {
          throw new Error(
            `No signature named ${inputOrSignatureName} found in model.`
          );
        }
        if (!maybeInput) {
          throw new Error(
            `No input provided for signature ${inputOrSignatureName}`
          );
        }
        input = maybeInput;
      } else {
        signature = this.defaultSignature;
        input = inputOrSignatureName;
      }
      return [signature, input];
    }
    get deleted() {
      return this.deletedInternal;
    }
    ensureNotDeleted() {
      if (this.deleted) {
        throw new Error("CompiledModel is deleted and cannot be used.");
      }
    }
    get isFullyAccelerated() {
      this.ensureNotDeleted();
      return this.liteRtCompiledModel.isFullyAccelerated();
    }
    delete() {
      if (this.deletedInternal) {
        return;
      }
      this.deletedInternal = true;
      this.liteRtCompiledModel.delete();
      this.model.delete();
      for (const signatureRunner of Object.values(
        this.compiledModelSignatureRunners
      )) {
        signatureRunner.delete();
      }
      this.onDelete();
    }
  };
  async function urlToUint8Array(url) {
    const response = await fetch(url);
    return new Uint8Array(await response.arrayBuffer());
  }
  async function readableStreamDefaultReaderToUint8Array(reader) {
    let byteOffset = 0;
    let array = new Uint8Array(
      1024
      /* arbitrary starting size */
    );
    const MAX_ARRAY_SIZE = 2e9;
    while (true) {
      const { done, value } = await reader.read();
      if (value) {
        if (array.byteLength < byteOffset + value.byteLength) {
          if (byteOffset + value.byteLength > MAX_ARRAY_SIZE) {
            throw new Error(`Model is too large (> ${MAX_ARRAY_SIZE} bytes).`);
          }
          const newArray = new Uint8Array(Math.min(
            MAX_ARRAY_SIZE,
            Math.max(array.byteLength, value.byteLength) * 2
          ));
          newArray.set(array);
          array = newArray;
        }
        array.set(value, byteOffset);
        byteOffset += value.byteLength;
      }
      if (done) {
        break;
      }
    }
    return array.slice(0, byteOffset);
  }
  var Model = class {
    constructor(liteRtModel, onDelete) {
      this.liteRtModel = liteRtModel;
      this.onDelete = onDelete;
    }
    delete() {
      this.liteRtModel.delete();
      this.onDelete();
    }
  };
  function isWebGPUSupported() {
    return !!(typeof globalThis !== "undefined" && globalThis.navigator && globalThis.navigator.gpu);
  }
  function loadAndCompile(model, compileOptions) {
    return getGlobalLiteRt().loadAndCompile(model, compileOptions);
  }
  var LiteRt = class {
    constructor(wasmModule) {
      __publicField(this, "liteRtWasm");
      __publicField(this, "defaultEnvironment");
      __publicField(this, "objectsToDelete", /* @__PURE__ */ new Set());
      this.liteRtWasm = wasmModule;
      this.liteRtWasm.setupLogging();
    }
    setDefaultEnvironment(environment) {
      this.defaultEnvironment = environment;
    }
    getDefaultEnvironment() {
      if (!this.defaultEnvironment) {
        throw new Error("Default environment is not set.");
      }
      return this.defaultEnvironment;
    }
    setWebGpuDevice(device) {
      const oldEnvironment = this.getDefaultEnvironment();
      this.setDefaultEnvironment(new Environment({
        ...oldEnvironment.options,
        webGpuDevice: device
      }));
    }
    getWebGpuDevice() {
      return this.getDefaultEnvironment().webGpuDevice;
    }
    /**
     * Loads and compiles a LiteRt model.
     *
     * @param model The model data. This can be a string (the model url), a URL
     *     object, a Uint8Array (the model bytes), or a
     *     ReadableStreamDefaultReader (for streaming model loading).
     * @param compileOptions The options for compiling the model. This includes
     *     the accelerator to use ('webgpu' or 'wasm') and the WebGPU device
     *     (for direct GPU model inputs / outputs).
     * @returns A promise that resolves to the CompiledModel.
     */
    async loadAndCompile(model, compileOptions = {}) {
      let modelData;
      if (typeof model === "string" || model instanceof URL) {
        modelData = await urlToUint8Array(model);
      } else if (model instanceof Uint8Array) {
        modelData = model;
      } else if (model instanceof ReadableStreamDefaultReader) {
        modelData = await readableStreamDefaultReaderToUint8Array(model);
      } else {
        throw new Error("Unsupported model type.");
      }
      const environment = compileOptions.environment ?? this.getDefaultEnvironment();
      const accelerator = compileOptions.accelerator ?? (environment.webGpuDevice ? "webgpu" : "wasm");
      const acceleratorIncludesWebGpu = Array.isArray(accelerator) ? accelerator.includes("webgpu") : accelerator === "webgpu";
      if (acceleratorIncludesWebGpu && !environment.webGpuDevice) {
        throw new Error(
          "WebGPU was requested but no WebGPU device is set in the environment."
        );
      }
      const cpuOptions = compileOptions.cpuOptions ?? { numThreads: this.liteRtWasm.getThreadCount() };
      const filledCompileOptions = {
        environment,
        accelerator,
        cpuOptions,
        gpuOptions: compileOptions.gpuOptions ?? {},
        webNNOptions: compileOptions.webNNOptions ?? {}
      };
      const ptr = this.liteRtWasm._malloc(modelData.byteLength);
      this.liteRtWasm.HEAPU8.set(modelData, ptr);
      const wasmModel = this.liteRtWasm.loadModel(
        filledCompileOptions.environment.liteRtEnvironment,
        ptr,
        modelData.byteLength
      );
      const wasmCompiledModel = await this.liteRtWasm.compileModel(
        filledCompileOptions.environment.liteRtEnvironment,
        wasmModel,
        filledCompileOptions
      );
      const loadedModel = new Model(wasmModel, () => {
        this.liteRtWasm._free(ptr);
      });
      const compiledModel = new CompiledModel(
        loadedModel,
        wasmCompiledModel,
        filledCompileOptions,
        () => {
          this.objectsToDelete.delete(compiledModel);
        }
      );
      this.objectsToDelete.add(compiledModel);
      return compiledModel;
    }
    delete() {
      for (const object of this.objectsToDelete) {
        object.delete();
      }
    }
  };
  function pathToString(path) {
    return path;
  }
  function appendPathSegment(path, segment) {
    if (!path) return segment;
    if (!segment) return path;
    const pathWithSlash = path.endsWith("/") ? path : path + "/";
    const segmentWithoutSlash = segment.startsWith("/") ? segment.substring(1) : segment;
    return pathWithSlash + segmentWithoutSlash;
  }
  var WASM_RELAXED_SIMD_CHECK = new Uint8Array([
    0,
    97,
    115,
    109,
    1,
    0,
    0,
    0,
    1,
    5,
    1,
    96,
    0,
    1,
    123,
    3,
    2,
    1,
    0,
    10,
    15,
    1,
    13,
    0,
    65,
    1,
    253,
    15,
    65,
    2,
    253,
    15,
    253,
    128,
    2,
    11
  ]);
  var WASM_THREADS_CHECK = new Uint8Array([
    0,
    97,
    115,
    109,
    1,
    0,
    0,
    0,
    1,
    4,
    1,
    96,
    0,
    0,
    3,
    2,
    1,
    0,
    5,
    4,
    1,
    3,
    1,
    1,
    10,
    11,
    1,
    9,
    0,
    65,
    0,
    254,
    16,
    2,
    0,
    26,
    11
  ]);
  var WASM_FEATURE_VALUES = {
    "relaxedSimd": void 0,
    "threads": void 0,
    "jspi": void 0,
    "webnn": void 0
  };
  function isJspiSupported() {
    return "Suspending" in WebAssembly;
  }
  function isWebNnSupported() {
    return typeof navigator !== "undefined" && !!navigator.ml;
  }
  async function tryWasm(wasm) {
    try {
      await WebAssembly.instantiate(wasm);
      return { supported: true };
    } catch (e5) {
      return { supported: false, error: e5 };
    }
  }
  var WASM_FEATURE_CHECKS = {
    "relaxedSimd": () => {
      if (WASM_FEATURE_VALUES.relaxedSimd === void 0) {
        WASM_FEATURE_VALUES.relaxedSimd = tryWasm(WASM_RELAXED_SIMD_CHECK);
      }
      return WASM_FEATURE_VALUES.relaxedSimd;
    },
    "threads": () => {
      if (WASM_FEATURE_VALUES.threads === void 0) {
        try {
          if (typeof MessageChannel !== "undefined") {
            new MessageChannel().port1.postMessage(new SharedArrayBuffer(1));
          }
          WASM_FEATURE_VALUES.threads = tryWasm(WASM_THREADS_CHECK);
        } catch (e5) {
          WASM_FEATURE_VALUES.threads = Promise.resolve({ supported: false, error: e5 });
        }
      }
      return WASM_FEATURE_VALUES.threads;
    },
    "jspi": () => {
      if (WASM_FEATURE_VALUES.jspi === void 0) {
        const supported = isJspiSupported();
        WASM_FEATURE_VALUES.jspi = Promise.resolve({
          supported,
          error: supported ? void 0 : new Error("JSPI is not supported")
        });
      }
      return WASM_FEATURE_VALUES.jspi;
    },
    "webnn": () => {
      if (WASM_FEATURE_VALUES.webnn === void 0) {
        const supported = isWebNnSupported();
        WASM_FEATURE_VALUES.webnn = Promise.resolve({
          supported,
          error: supported ? void 0 : new Error("WebNN is not supported")
        });
      }
      return WASM_FEATURE_VALUES.webnn;
    }
  };
  async function supportsFeature(feature) {
    const check = WASM_FEATURE_CHECKS[feature]?.();
    if (!check) {
      throw new Error(`Unknown feature: ${feature}`);
    }
    return (await check).supported;
  }
  async function throwIfFeatureNotSupported(feature) {
    const check = WASM_FEATURE_CHECKS[feature]?.();
    if (!check) {
      throw new Error(`Unknown feature: ${feature}`);
    }
    const result = await check;
    if (!result.supported) {
      throw result.error;
    }
  }
  var WASM_JS_FILE_NAME = "litert_wasm_internal.js";
  var WASM_JS_COMPAT_FILE_NAME = "litert_wasm_compat_internal.js";
  var WASM_JS_THREADED_FILE_NAME = "litert_wasm_threaded_internal.js";
  var WASM_JS_JSPI_FILE_NAME = "litert_wasm_jspi_internal.js";
  async function load(path, options) {
    const pathString = pathToString(path);
    const isFullFilePath = pathString.endsWith(".wasm") || pathString.endsWith(".js");
    const relaxedSimd = await supportsFeature("relaxedSimd");
    if (options?.threads) {
      if (options?.jspi) {
        throw new Error(
          "The `threads` and `jspi` options are mutually exclusive."
        );
      }
      if (isFullFilePath) {
        console.warn(
          `The \`threads\` option was specified, but the wasm path ${pathString} is a full file path. Whether threads are available or not will depend on the loaded file. To allow LiteRT.js to load the threaded wasm file, use a directory path instead of a full file path.`
        );
      }
      if (!relaxedSimd) {
        throw new Error(
          "Threads are only supported with relaxed SIMD, and the current browser does not support relaxed SIMD."
        );
      }
      await throwIfFeatureNotSupported("threads");
    }
    if (options?.jspi) {
      if (isFullFilePath) {
        console.warn(
          `The \`jspi\` option was specified, but the wasm path ${pathString} is a full file path. Whether JSPI is available or not will depend on the loaded file. To allow LiteRT.js to load the JSPI wasm file, use a directory path instead of a full file path.`
        );
      }
      await throwIfFeatureNotSupported("jspi");
    }
    let fileName = WASM_JS_COMPAT_FILE_NAME;
    if (relaxedSimd) {
      if (options?.threads) {
        fileName = WASM_JS_THREADED_FILE_NAME;
      } else if (options?.jspi) {
        fileName = WASM_JS_JSPI_FILE_NAME;
      } else {
        fileName = WASM_JS_FILE_NAME;
      }
    }
    let jsFilePath = path;
    if (pathString.endsWith(".wasm")) {
      throw new Error(
        "Please load the `.js` file corresponding to the `.wasm` file, or load the directory containing it."
      );
    } else if (!pathString.endsWith(".js")) {
      jsFilePath = appendPathSegment(path, fileName);
    }
    return createWasmLib(LiteRt, jsFilePath);
  }
  function loadLiteRt(path, options) {
    if (hasGlobalLiteRtPromise()) {
      throw new Error("LiteRT is already loading / loaded.");
    }
    setGlobalLiteRtPromise(load(path, options).then(async (liteRt) => {
      setGlobalLiteRt(liteRt);
      liteRt.setDefaultEnvironment(
        await Environment.create()
      );
      return liteRt;
    }).catch((error) => {
      setGlobalLiteRtPromise(void 0);
      throw error;
    }));
    return getGlobalLiteRtPromise();
  }
  async function copyHostMemoryToHostMemory(cpuTensor, options = {}) {
    const environment = options.environment ?? cpuTensor.environment;
    const liteRtWasm = getGlobalLiteRt().liteRtWasm;
    const srcTensorBuffer = cpuTensor.liteRtTensorBuffer;
    const bufferType = srcTensorBuffer.bufferType();
    if (bufferType.value !== TensorBufferType.HOST_MEMORY) {
      throw new Error(
        "Source tensor is not in host memory. Cannot copy to host memory."
      );
    }
    const srcTensorMemoryPtr = srcTensorBuffer.lock(
      liteRtWasm.LiteRtTensorBufferLockMode.READ
    );
    let destTensorBuffer;
    try {
      destTensorBuffer = liteRtWasm.LiteRtTensorBuffer.createManaged(
        environment.liteRtEnvironment,
        liteRtWasm.LiteRtTensorBufferType.HOST_MEMORY,
        srcTensorBuffer.tensorType(),
        srcTensorBuffer.size()
      );
      const destMemoryPointer = destTensorBuffer.lock(
        liteRtWasm.LiteRtTensorBufferLockMode.WRITE
      );
      try {
        const srcTensorMemoryView = new Uint8Array(
          liteRtWasm.HEAPU8.buffer,
          srcTensorMemoryPtr,
          srcTensorBuffer.size()
        );
        liteRtWasm.HEAPU8.set(srcTensorMemoryView, destMemoryPointer);
      } finally {
        destTensorBuffer.unlock();
      }
    } finally {
      srcTensorBuffer.unlock();
    }
    if (!destTensorBuffer) {
      throw new Error("Failed to create destination tensor buffer.");
    }
    return new Tensor(destTensorBuffer, environment);
  }
  async function cpuTensorToGpuTensor(cpuTensor, options = {}) {
    const environment = options.environment ?? cpuTensor.environment;
    const device = environment.webGpuDevice;
    if (!device) {
      throw new Error(
        "No WebGPU device is available. Did you forget to pass a destination environment that has a WebGPU device?"
      );
    }
    const liteRtWasm = getGlobalLiteRt().liteRtWasm;
    const byteLength = cpuTensor.liteRtTensorBuffer.size();
    const paddedByteLength = byteLength + 3 & ~3;
    const stagingBuffer = device.createBuffer({
      size: paddedByteLength,
      usage: GPUBufferUsage.MAP_WRITE | GPUBufferUsage.COPY_SRC,
      mappedAtCreation: true
    });
    const mappedBuffer = await stagingBuffer.getMappedRange();
    const mappedArray = new Uint8Array(mappedBuffer);
    const cpuMemoryPtr = cpuTensor.liteRtTensorBuffer.lock(
      liteRtWasm.LiteRtTensorBufferLockMode.READ
    );
    try {
      const cpuMemoryView = new Uint8Array(
        liteRtWasm.HEAPU8.buffer,
        cpuMemoryPtr,
        cpuTensor.liteRtTensorBuffer.size()
      );
      mappedArray.set(cpuMemoryView);
    } finally {
      cpuTensor.liteRtTensorBuffer.unlock();
    }
    stagingBuffer.unmap();
    const buffer = device.createBuffer({
      size: paddedByteLength,
      usage: GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST | GPUBufferUsage.STORAGE
    });
    const commandEncoder = device.createCommandEncoder();
    commandEncoder.copyBufferToBuffer(
      stagingBuffer,
      0,
      buffer,
      0,
      paddedByteLength
    );
    device.queue.submit([commandEncoder.finish()]);
    stagingBuffer.destroy();
    return new Tensor(
      buffer,
      cpuTensor.type.layout.dimensions,
      cpuTensor.type.dtype,
      environment,
      () => {
        buffer.destroy();
      }
    );
  }
  async function gpuTensorToCpuTensor(gpuTensor, options = {}) {
    const environment = options.environment ?? gpuTensor.environment;
    const device = gpuTensor.environment.webGpuDevice;
    if (!device) {
      throw new Error(
        "No WebGPU device is available. Does the source tensor have a WebGPU device?"
      );
    }
    const liteRtWasm = getGlobalLiteRt().liteRtWasm;
    const tensorBuffer = gpuTensor.liteRtTensorBuffer;
    const bufferType = tensorBuffer.bufferType();
    if (bufferType !== liteRtWasm.LiteRtTensorBufferType.WEB_GPU_BUFFER_PACKED) {
      throw new Error(`Cannot convert a tensor with a non-WebGPU buffer type ${bufferType} to a CPU tensor.`);
    }
    const gpuBuffer = liteRtWasm.WebGPU.getJsObject(
      tensorBuffer.getWebGpuBuffer()
    );
    const byteOffset = tensorBuffer.offset();
    const tensorType = tensorBuffer.tensorType();
    const layout = tensorType.layout();
    const numElements = layout.numElements();
    const arrayConstructor = getDataType(tensorType.elementType().value).typedArrayConstructor;
    layout.delete();
    tensorType.delete();
    let mappableBuffer = gpuBuffer;
    let cleanupBuffer = () => {
    };
    if (!(gpuBuffer.usage & GPUBufferUsage.MAP_READ)) {
      mappableBuffer = device.createBuffer({
        size: gpuBuffer.size,
        usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
      });
      cleanupBuffer = () => {
        mappableBuffer.destroy();
      };
      const commandEncoder = device.createCommandEncoder();
      commandEncoder.copyBufferToBuffer(
        gpuBuffer,
        0,
        mappableBuffer,
        0,
        gpuBuffer.size
      );
      device.queue.submit([commandEncoder.finish()]);
    }
    await mappableBuffer.mapAsync(GPUMapMode.READ);
    const mappedBuffer = mappableBuffer.getMappedRange();
    const mappedArray = new arrayConstructor(mappedBuffer, byteOffset, numElements);
    const cpuTensor = new Tensor(mappedArray, gpuTensor.type.layout.dimensions, environment);
    mappableBuffer.unmap();
    cleanupBuffer();
    return cpuTensor;
  }
  function makeMoveTo(copyTo) {
    return async (tensor, options) => {
      const result = await copyTo(tensor, options);
      tensor.delete();
      return result;
    };
  }
  function registerCopyFunctions() {
    Tensor.copyFunctions.set(TensorBufferType.HOST_MEMORY, /* @__PURE__ */ new Map([
      [
        TensorBufferType.HOST_MEMORY,
        {
          copyTo: copyHostMemoryToHostMemory,
          // There might be a more efficient way to move
          // from CPU to CPU.
          moveTo: makeMoveTo(copyHostMemoryToHostMemory)
        }
      ],
      [
        TensorBufferType.WEB_GPU_BUFFER_PACKED,
        {
          copyTo: cpuTensorToGpuTensor,
          moveTo: makeMoveTo(cpuTensorToGpuTensor)
        }
      ]
    ]));
    Tensor.copyFunctions.set(TensorBufferType.WEB_GPU_BUFFER_PACKED, /* @__PURE__ */ new Map([
      [
        TensorBufferType.HOST_MEMORY,
        {
          copyTo: gpuTensorToCpuTensor,
          moveTo: makeMoveTo(gpuTensorToCpuTensor)
        }
      ]
    ]));
  }
  registerCopyFunctions();

  // ../../node_modules/@lit/reactive-element/css-tag.js
  var t = globalThis;
  var e = t.ShadowRoot && (void 0 === t.ShadyCSS || t.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
  var s = Symbol();
  var o = /* @__PURE__ */ new WeakMap();
  var n = class {
    constructor(t4, e5, o6) {
      if (this._$cssResult$ = true, o6 !== s) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
      this.cssText = t4, this.t = e5;
    }
    get styleSheet() {
      let t4 = this.o;
      const s4 = this.t;
      if (e && void 0 === t4) {
        const e5 = void 0 !== s4 && 1 === s4.length;
        e5 && (t4 = o.get(s4)), void 0 === t4 && ((this.o = t4 = new CSSStyleSheet()).replaceSync(this.cssText), e5 && o.set(s4, t4));
      }
      return t4;
    }
    toString() {
      return this.cssText;
    }
  };
  var r = (t4) => new n("string" == typeof t4 ? t4 : t4 + "", void 0, s);
  var i = (t4, ...e5) => {
    const o6 = 1 === t4.length ? t4[0] : e5.reduce(((e6, s4, o7) => e6 + ((t5) => {
      if (true === t5._$cssResult$) return t5.cssText;
      if ("number" == typeof t5) return t5;
      throw Error("Value passed to 'css' function must be a 'css' function result: " + t5 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
    })(s4) + t4[o7 + 1]), t4[0]);
    return new n(o6, t4, s);
  };
  var S = (s4, o6) => {
    if (e) s4.adoptedStyleSheets = o6.map(((t4) => t4 instanceof CSSStyleSheet ? t4 : t4.styleSheet));
    else for (const e5 of o6) {
      const o7 = document.createElement("style"), n5 = t.litNonce;
      void 0 !== n5 && o7.setAttribute("nonce", n5), o7.textContent = e5.cssText, s4.appendChild(o7);
    }
  };
  var c = e ? (t4) => t4 : (t4) => t4 instanceof CSSStyleSheet ? ((t5) => {
    let e5 = "";
    for (const s4 of t5.cssRules) e5 += s4.cssText;
    return r(e5);
  })(t4) : t4;

  // ../../node_modules/@lit/reactive-element/reactive-element.js
  var { is: i2, defineProperty: e2, getOwnPropertyDescriptor: h, getOwnPropertyNames: r2, getOwnPropertySymbols: o2, getPrototypeOf: n2 } = Object;
  var a = globalThis;
  var c2 = a.trustedTypes;
  var l = c2 ? c2.emptyScript : "";
  var p = a.reactiveElementPolyfillSupport;
  var d = (t4, s4) => t4;
  var u = { toAttribute(t4, s4) {
    switch (s4) {
      case Boolean:
        t4 = t4 ? l : null;
        break;
      case Object:
      case Array:
        t4 = null == t4 ? t4 : JSON.stringify(t4);
    }
    return t4;
  }, fromAttribute(t4, s4) {
    let i5 = t4;
    switch (s4) {
      case Boolean:
        i5 = null !== t4;
        break;
      case Number:
        i5 = null === t4 ? null : Number(t4);
        break;
      case Object:
      case Array:
        try {
          i5 = JSON.parse(t4);
        } catch (t5) {
          i5 = null;
        }
    }
    return i5;
  } };
  var f = (t4, s4) => !i2(t4, s4);
  var b = { attribute: true, type: String, converter: u, reflect: false, useDefault: false, hasChanged: f };
  Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), a.litPropertyMetadata ?? (a.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
  var y = class extends HTMLElement {
    static addInitializer(t4) {
      this._$Ei(), (this.l ?? (this.l = [])).push(t4);
    }
    static get observedAttributes() {
      return this.finalize(), this._$Eh && [...this._$Eh.keys()];
    }
    static createProperty(t4, s4 = b) {
      if (s4.state && (s4.attribute = false), this._$Ei(), this.prototype.hasOwnProperty(t4) && ((s4 = Object.create(s4)).wrapped = true), this.elementProperties.set(t4, s4), !s4.noAccessor) {
        const i5 = Symbol(), h3 = this.getPropertyDescriptor(t4, i5, s4);
        void 0 !== h3 && e2(this.prototype, t4, h3);
      }
    }
    static getPropertyDescriptor(t4, s4, i5) {
      const { get: e5, set: r6 } = h(this.prototype, t4) ?? { get() {
        return this[s4];
      }, set(t5) {
        this[s4] = t5;
      } };
      return { get: e5, set(s5) {
        const h3 = e5?.call(this);
        r6?.call(this, s5), this.requestUpdate(t4, h3, i5);
      }, configurable: true, enumerable: true };
    }
    static getPropertyOptions(t4) {
      return this.elementProperties.get(t4) ?? b;
    }
    static _$Ei() {
      if (this.hasOwnProperty(d("elementProperties"))) return;
      const t4 = n2(this);
      t4.finalize(), void 0 !== t4.l && (this.l = [...t4.l]), this.elementProperties = new Map(t4.elementProperties);
    }
    static finalize() {
      if (this.hasOwnProperty(d("finalized"))) return;
      if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d("properties"))) {
        const t5 = this.properties, s4 = [...r2(t5), ...o2(t5)];
        for (const i5 of s4) this.createProperty(i5, t5[i5]);
      }
      const t4 = this[Symbol.metadata];
      if (null !== t4) {
        const s4 = litPropertyMetadata.get(t4);
        if (void 0 !== s4) for (const [t5, i5] of s4) this.elementProperties.set(t5, i5);
      }
      this._$Eh = /* @__PURE__ */ new Map();
      for (const [t5, s4] of this.elementProperties) {
        const i5 = this._$Eu(t5, s4);
        void 0 !== i5 && this._$Eh.set(i5, t5);
      }
      this.elementStyles = this.finalizeStyles(this.styles);
    }
    static finalizeStyles(s4) {
      const i5 = [];
      if (Array.isArray(s4)) {
        const e5 = new Set(s4.flat(1 / 0).reverse());
        for (const s5 of e5) i5.unshift(c(s5));
      } else void 0 !== s4 && i5.push(c(s4));
      return i5;
    }
    static _$Eu(t4, s4) {
      const i5 = s4.attribute;
      return false === i5 ? void 0 : "string" == typeof i5 ? i5 : "string" == typeof t4 ? t4.toLowerCase() : void 0;
    }
    constructor() {
      super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
    }
    _$Ev() {
      this._$ES = new Promise(((t4) => this.enableUpdating = t4)), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach(((t4) => t4(this)));
    }
    addController(t4) {
      (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t4), void 0 !== this.renderRoot && this.isConnected && t4.hostConnected?.();
    }
    removeController(t4) {
      this._$EO?.delete(t4);
    }
    _$E_() {
      const t4 = /* @__PURE__ */ new Map(), s4 = this.constructor.elementProperties;
      for (const i5 of s4.keys()) this.hasOwnProperty(i5) && (t4.set(i5, this[i5]), delete this[i5]);
      t4.size > 0 && (this._$Ep = t4);
    }
    createRenderRoot() {
      const t4 = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
      return S(t4, this.constructor.elementStyles), t4;
    }
    connectedCallback() {
      this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(true), this._$EO?.forEach(((t4) => t4.hostConnected?.()));
    }
    enableUpdating(t4) {
    }
    disconnectedCallback() {
      this._$EO?.forEach(((t4) => t4.hostDisconnected?.()));
    }
    attributeChangedCallback(t4, s4, i5) {
      this._$AK(t4, i5);
    }
    _$ET(t4, s4) {
      const i5 = this.constructor.elementProperties.get(t4), e5 = this.constructor._$Eu(t4, i5);
      if (void 0 !== e5 && true === i5.reflect) {
        const h3 = (void 0 !== i5.converter?.toAttribute ? i5.converter : u).toAttribute(s4, i5.type);
        this._$Em = t4, null == h3 ? this.removeAttribute(e5) : this.setAttribute(e5, h3), this._$Em = null;
      }
    }
    _$AK(t4, s4) {
      const i5 = this.constructor, e5 = i5._$Eh.get(t4);
      if (void 0 !== e5 && this._$Em !== e5) {
        const t5 = i5.getPropertyOptions(e5), h3 = "function" == typeof t5.converter ? { fromAttribute: t5.converter } : void 0 !== t5.converter?.fromAttribute ? t5.converter : u;
        this._$Em = e5;
        const r6 = h3.fromAttribute(s4, t5.type);
        this[e5] = r6 ?? this._$Ej?.get(e5) ?? r6, this._$Em = null;
      }
    }
    requestUpdate(t4, s4, i5) {
      if (void 0 !== t4) {
        const e5 = this.constructor, h3 = this[t4];
        if (i5 ?? (i5 = e5.getPropertyOptions(t4)), !((i5.hasChanged ?? f)(h3, s4) || i5.useDefault && i5.reflect && h3 === this._$Ej?.get(t4) && !this.hasAttribute(e5._$Eu(t4, i5)))) return;
        this.C(t4, s4, i5);
      }
      false === this.isUpdatePending && (this._$ES = this._$EP());
    }
    C(t4, s4, { useDefault: i5, reflect: e5, wrapped: h3 }, r6) {
      i5 && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t4) && (this._$Ej.set(t4, r6 ?? s4 ?? this[t4]), true !== h3 || void 0 !== r6) || (this._$AL.has(t4) || (this.hasUpdated || i5 || (s4 = void 0), this._$AL.set(t4, s4)), true === e5 && this._$Em !== t4 && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t4));
    }
    async _$EP() {
      this.isUpdatePending = true;
      try {
        await this._$ES;
      } catch (t5) {
        Promise.reject(t5);
      }
      const t4 = this.scheduleUpdate();
      return null != t4 && await t4, !this.isUpdatePending;
    }
    scheduleUpdate() {
      return this.performUpdate();
    }
    performUpdate() {
      if (!this.isUpdatePending) return;
      if (!this.hasUpdated) {
        if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
          for (const [t6, s5] of this._$Ep) this[t6] = s5;
          this._$Ep = void 0;
        }
        const t5 = this.constructor.elementProperties;
        if (t5.size > 0) for (const [s5, i5] of t5) {
          const { wrapped: t6 } = i5, e5 = this[s5];
          true !== t6 || this._$AL.has(s5) || void 0 === e5 || this.C(s5, void 0, i5, e5);
        }
      }
      let t4 = false;
      const s4 = this._$AL;
      try {
        t4 = this.shouldUpdate(s4), t4 ? (this.willUpdate(s4), this._$EO?.forEach(((t5) => t5.hostUpdate?.())), this.update(s4)) : this._$EM();
      } catch (s5) {
        throw t4 = false, this._$EM(), s5;
      }
      t4 && this._$AE(s4);
    }
    willUpdate(t4) {
    }
    _$AE(t4) {
      this._$EO?.forEach(((t5) => t5.hostUpdated?.())), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t4)), this.updated(t4);
    }
    _$EM() {
      this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
    }
    get updateComplete() {
      return this.getUpdateComplete();
    }
    getUpdateComplete() {
      return this._$ES;
    }
    shouldUpdate(t4) {
      return true;
    }
    update(t4) {
      this._$Eq && (this._$Eq = this._$Eq.forEach(((t5) => this._$ET(t5, this[t5])))), this._$EM();
    }
    updated(t4) {
    }
    firstUpdated(t4) {
    }
  };
  y.elementStyles = [], y.shadowRootOptions = { mode: "open" }, y[d("elementProperties")] = /* @__PURE__ */ new Map(), y[d("finalized")] = /* @__PURE__ */ new Map(), p?.({ ReactiveElement: y }), (a.reactiveElementVersions ?? (a.reactiveElementVersions = [])).push("2.1.1");

  // ../../node_modules/lit-html/lit-html.js
  var t2 = globalThis;
  var i3 = t2.trustedTypes;
  var s2 = i3 ? i3.createPolicy("lit-html", { createHTML: (t4) => t4 }) : void 0;
  var e3 = "$lit$";
  var h2 = `lit$${Math.random().toFixed(9).slice(2)}$`;
  var o3 = "?" + h2;
  var n3 = `<${o3}>`;
  var r3 = document;
  var l2 = () => r3.createComment("");
  var c3 = (t4) => null === t4 || "object" != typeof t4 && "function" != typeof t4;
  var a2 = Array.isArray;
  var u2 = (t4) => a2(t4) || "function" == typeof t4?.[Symbol.iterator];
  var d2 = "[ 	\n\f\r]";
  var f2 = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
  var v = /-->/g;
  var _ = />/g;
  var m = RegExp(`>|${d2}(?:([^\\s"'>=/]+)(${d2}*=${d2}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
  var p2 = /'/g;
  var g = /"/g;
  var $ = /^(?:script|style|textarea|title)$/i;
  var y2 = (t4) => (i5, ...s4) => ({ _$litType$: t4, strings: i5, values: s4 });
  var x = y2(1);
  var b2 = y2(2);
  var w = y2(3);
  var T = Symbol.for("lit-noChange");
  var E = Symbol.for("lit-nothing");
  var A = /* @__PURE__ */ new WeakMap();
  var C = r3.createTreeWalker(r3, 129);
  function P(t4, i5) {
    if (!a2(t4) || !t4.hasOwnProperty("raw")) throw Error("invalid template strings array");
    return void 0 !== s2 ? s2.createHTML(i5) : i5;
  }
  var V = (t4, i5) => {
    const s4 = t4.length - 1, o6 = [];
    let r6, l3 = 2 === i5 ? "<svg>" : 3 === i5 ? "<math>" : "", c4 = f2;
    for (let i6 = 0; i6 < s4; i6++) {
      const s5 = t4[i6];
      let a3, u3, d3 = -1, y3 = 0;
      for (; y3 < s5.length && (c4.lastIndex = y3, u3 = c4.exec(s5), null !== u3); ) y3 = c4.lastIndex, c4 === f2 ? "!--" === u3[1] ? c4 = v : void 0 !== u3[1] ? c4 = _ : void 0 !== u3[2] ? ($.test(u3[2]) && (r6 = RegExp("</" + u3[2], "g")), c4 = m) : void 0 !== u3[3] && (c4 = m) : c4 === m ? ">" === u3[0] ? (c4 = r6 ?? f2, d3 = -1) : void 0 === u3[1] ? d3 = -2 : (d3 = c4.lastIndex - u3[2].length, a3 = u3[1], c4 = void 0 === u3[3] ? m : '"' === u3[3] ? g : p2) : c4 === g || c4 === p2 ? c4 = m : c4 === v || c4 === _ ? c4 = f2 : (c4 = m, r6 = void 0);
      const x2 = c4 === m && t4[i6 + 1].startsWith("/>") ? " " : "";
      l3 += c4 === f2 ? s5 + n3 : d3 >= 0 ? (o6.push(a3), s5.slice(0, d3) + e3 + s5.slice(d3) + h2 + x2) : s5 + h2 + (-2 === d3 ? i6 : x2);
    }
    return [P(t4, l3 + (t4[s4] || "<?>") + (2 === i5 ? "</svg>" : 3 === i5 ? "</math>" : "")), o6];
  };
  var N = class _N {
    constructor({ strings: t4, _$litType$: s4 }, n5) {
      let r6;
      this.parts = [];
      let c4 = 0, a3 = 0;
      const u3 = t4.length - 1, d3 = this.parts, [f3, v2] = V(t4, s4);
      if (this.el = _N.createElement(f3, n5), C.currentNode = this.el.content, 2 === s4 || 3 === s4) {
        const t5 = this.el.content.firstChild;
        t5.replaceWith(...t5.childNodes);
      }
      for (; null !== (r6 = C.nextNode()) && d3.length < u3; ) {
        if (1 === r6.nodeType) {
          if (r6.hasAttributes()) for (const t5 of r6.getAttributeNames()) if (t5.endsWith(e3)) {
            const i5 = v2[a3++], s5 = r6.getAttribute(t5).split(h2), e5 = /([.?@])?(.*)/.exec(i5);
            d3.push({ type: 1, index: c4, name: e5[2], strings: s5, ctor: "." === e5[1] ? H : "?" === e5[1] ? I : "@" === e5[1] ? L : k }), r6.removeAttribute(t5);
          } else t5.startsWith(h2) && (d3.push({ type: 6, index: c4 }), r6.removeAttribute(t5));
          if ($.test(r6.tagName)) {
            const t5 = r6.textContent.split(h2), s5 = t5.length - 1;
            if (s5 > 0) {
              r6.textContent = i3 ? i3.emptyScript : "";
              for (let i5 = 0; i5 < s5; i5++) r6.append(t5[i5], l2()), C.nextNode(), d3.push({ type: 2, index: ++c4 });
              r6.append(t5[s5], l2());
            }
          }
        } else if (8 === r6.nodeType) if (r6.data === o3) d3.push({ type: 2, index: c4 });
        else {
          let t5 = -1;
          for (; -1 !== (t5 = r6.data.indexOf(h2, t5 + 1)); ) d3.push({ type: 7, index: c4 }), t5 += h2.length - 1;
        }
        c4++;
      }
    }
    static createElement(t4, i5) {
      const s4 = r3.createElement("template");
      return s4.innerHTML = t4, s4;
    }
  };
  function S2(t4, i5, s4 = t4, e5) {
    if (i5 === T) return i5;
    let h3 = void 0 !== e5 ? s4._$Co?.[e5] : s4._$Cl;
    const o6 = c3(i5) ? void 0 : i5._$litDirective$;
    return h3?.constructor !== o6 && (h3?._$AO?.(false), void 0 === o6 ? h3 = void 0 : (h3 = new o6(t4), h3._$AT(t4, s4, e5)), void 0 !== e5 ? (s4._$Co ?? (s4._$Co = []))[e5] = h3 : s4._$Cl = h3), void 0 !== h3 && (i5 = S2(t4, h3._$AS(t4, i5.values), h3, e5)), i5;
  }
  var M = class {
    constructor(t4, i5) {
      this._$AV = [], this._$AN = void 0, this._$AD = t4, this._$AM = i5;
    }
    get parentNode() {
      return this._$AM.parentNode;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    u(t4) {
      const { el: { content: i5 }, parts: s4 } = this._$AD, e5 = (t4?.creationScope ?? r3).importNode(i5, true);
      C.currentNode = e5;
      let h3 = C.nextNode(), o6 = 0, n5 = 0, l3 = s4[0];
      for (; void 0 !== l3; ) {
        if (o6 === l3.index) {
          let i6;
          2 === l3.type ? i6 = new R(h3, h3.nextSibling, this, t4) : 1 === l3.type ? i6 = new l3.ctor(h3, l3.name, l3.strings, this, t4) : 6 === l3.type && (i6 = new z(h3, this, t4)), this._$AV.push(i6), l3 = s4[++n5];
        }
        o6 !== l3?.index && (h3 = C.nextNode(), o6++);
      }
      return C.currentNode = r3, e5;
    }
    p(t4) {
      let i5 = 0;
      for (const s4 of this._$AV) void 0 !== s4 && (void 0 !== s4.strings ? (s4._$AI(t4, s4, i5), i5 += s4.strings.length - 2) : s4._$AI(t4[i5])), i5++;
    }
  };
  var R = class _R {
    get _$AU() {
      return this._$AM?._$AU ?? this._$Cv;
    }
    constructor(t4, i5, s4, e5) {
      this.type = 2, this._$AH = E, this._$AN = void 0, this._$AA = t4, this._$AB = i5, this._$AM = s4, this.options = e5, this._$Cv = e5?.isConnected ?? true;
    }
    get parentNode() {
      let t4 = this._$AA.parentNode;
      const i5 = this._$AM;
      return void 0 !== i5 && 11 === t4?.nodeType && (t4 = i5.parentNode), t4;
    }
    get startNode() {
      return this._$AA;
    }
    get endNode() {
      return this._$AB;
    }
    _$AI(t4, i5 = this) {
      t4 = S2(this, t4, i5), c3(t4) ? t4 === E || null == t4 || "" === t4 ? (this._$AH !== E && this._$AR(), this._$AH = E) : t4 !== this._$AH && t4 !== T && this._(t4) : void 0 !== t4._$litType$ ? this.$(t4) : void 0 !== t4.nodeType ? this.T(t4) : u2(t4) ? this.k(t4) : this._(t4);
    }
    O(t4) {
      return this._$AA.parentNode.insertBefore(t4, this._$AB);
    }
    T(t4) {
      this._$AH !== t4 && (this._$AR(), this._$AH = this.O(t4));
    }
    _(t4) {
      this._$AH !== E && c3(this._$AH) ? this._$AA.nextSibling.data = t4 : this.T(r3.createTextNode(t4)), this._$AH = t4;
    }
    $(t4) {
      const { values: i5, _$litType$: s4 } = t4, e5 = "number" == typeof s4 ? this._$AC(t4) : (void 0 === s4.el && (s4.el = N.createElement(P(s4.h, s4.h[0]), this.options)), s4);
      if (this._$AH?._$AD === e5) this._$AH.p(i5);
      else {
        const t5 = new M(e5, this), s5 = t5.u(this.options);
        t5.p(i5), this.T(s5), this._$AH = t5;
      }
    }
    _$AC(t4) {
      let i5 = A.get(t4.strings);
      return void 0 === i5 && A.set(t4.strings, i5 = new N(t4)), i5;
    }
    k(t4) {
      a2(this._$AH) || (this._$AH = [], this._$AR());
      const i5 = this._$AH;
      let s4, e5 = 0;
      for (const h3 of t4) e5 === i5.length ? i5.push(s4 = new _R(this.O(l2()), this.O(l2()), this, this.options)) : s4 = i5[e5], s4._$AI(h3), e5++;
      e5 < i5.length && (this._$AR(s4 && s4._$AB.nextSibling, e5), i5.length = e5);
    }
    _$AR(t4 = this._$AA.nextSibling, i5) {
      for (this._$AP?.(false, true, i5); t4 !== this._$AB; ) {
        const i6 = t4.nextSibling;
        t4.remove(), t4 = i6;
      }
    }
    setConnected(t4) {
      void 0 === this._$AM && (this._$Cv = t4, this._$AP?.(t4));
    }
  };
  var k = class {
    get tagName() {
      return this.element.tagName;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    constructor(t4, i5, s4, e5, h3) {
      this.type = 1, this._$AH = E, this._$AN = void 0, this.element = t4, this.name = i5, this._$AM = e5, this.options = h3, s4.length > 2 || "" !== s4[0] || "" !== s4[1] ? (this._$AH = Array(s4.length - 1).fill(new String()), this.strings = s4) : this._$AH = E;
    }
    _$AI(t4, i5 = this, s4, e5) {
      const h3 = this.strings;
      let o6 = false;
      if (void 0 === h3) t4 = S2(this, t4, i5, 0), o6 = !c3(t4) || t4 !== this._$AH && t4 !== T, o6 && (this._$AH = t4);
      else {
        const e6 = t4;
        let n5, r6;
        for (t4 = h3[0], n5 = 0; n5 < h3.length - 1; n5++) r6 = S2(this, e6[s4 + n5], i5, n5), r6 === T && (r6 = this._$AH[n5]), o6 || (o6 = !c3(r6) || r6 !== this._$AH[n5]), r6 === E ? t4 = E : t4 !== E && (t4 += (r6 ?? "") + h3[n5 + 1]), this._$AH[n5] = r6;
      }
      o6 && !e5 && this.j(t4);
    }
    j(t4) {
      t4 === E ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t4 ?? "");
    }
  };
  var H = class extends k {
    constructor() {
      super(...arguments), this.type = 3;
    }
    j(t4) {
      this.element[this.name] = t4 === E ? void 0 : t4;
    }
  };
  var I = class extends k {
    constructor() {
      super(...arguments), this.type = 4;
    }
    j(t4) {
      this.element.toggleAttribute(this.name, !!t4 && t4 !== E);
    }
  };
  var L = class extends k {
    constructor(t4, i5, s4, e5, h3) {
      super(t4, i5, s4, e5, h3), this.type = 5;
    }
    _$AI(t4, i5 = this) {
      if ((t4 = S2(this, t4, i5, 0) ?? E) === T) return;
      const s4 = this._$AH, e5 = t4 === E && s4 !== E || t4.capture !== s4.capture || t4.once !== s4.once || t4.passive !== s4.passive, h3 = t4 !== E && (s4 === E || e5);
      e5 && this.element.removeEventListener(this.name, this, s4), h3 && this.element.addEventListener(this.name, this, t4), this._$AH = t4;
    }
    handleEvent(t4) {
      "function" == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t4) : this._$AH.handleEvent(t4);
    }
  };
  var z = class {
    constructor(t4, i5, s4) {
      this.element = t4, this.type = 6, this._$AN = void 0, this._$AM = i5, this.options = s4;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AI(t4) {
      S2(this, t4);
    }
  };
  var j = t2.litHtmlPolyfillSupport;
  j?.(N, R), (t2.litHtmlVersions ?? (t2.litHtmlVersions = [])).push("3.3.1");
  var B = (t4, i5, s4) => {
    const e5 = s4?.renderBefore ?? i5;
    let h3 = e5._$litPart$;
    if (void 0 === h3) {
      const t5 = s4?.renderBefore ?? null;
      e5._$litPart$ = h3 = new R(i5.insertBefore(l2(), t5), t5, void 0, s4 ?? {});
    }
    return h3._$AI(t4), h3;
  };

  // ../../node_modules/lit-element/lit-element.js
  var s3 = globalThis;
  var i4 = class extends y {
    constructor() {
      super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
    }
    createRenderRoot() {
      var _a2;
      const t4 = super.createRenderRoot();
      return (_a2 = this.renderOptions).renderBefore ?? (_a2.renderBefore = t4.firstChild), t4;
    }
    update(t4) {
      const r6 = this.render();
      this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t4), this._$Do = B(r6, this.renderRoot, this.renderOptions);
    }
    connectedCallback() {
      super.connectedCallback(), this._$Do?.setConnected(true);
    }
    disconnectedCallback() {
      super.disconnectedCallback(), this._$Do?.setConnected(false);
    }
    render() {
      return T;
    }
  };
  i4._$litElement$ = true, i4["finalized"] = true, s3.litElementHydrateSupport?.({ LitElement: i4 });
  var o4 = s3.litElementPolyfillSupport;
  o4?.({ LitElement: i4 });
  (s3.litElementVersions ?? (s3.litElementVersions = [])).push("4.2.1");

  // ../../node_modules/@lit/reactive-element/decorators/custom-element.js
  var t3 = (t4) => (e5, o6) => {
    void 0 !== o6 ? o6.addInitializer((() => {
      customElements.define(t4, e5);
    })) : customElements.define(t4, e5);
  };

  // ../../node_modules/@lit/reactive-element/decorators/property.js
  var o5 = { attribute: true, type: String, converter: u, reflect: false, hasChanged: f };
  var r4 = (t4 = o5, e5, r6) => {
    const { kind: n5, metadata: i5 } = r6;
    let s4 = globalThis.litPropertyMetadata.get(i5);
    if (void 0 === s4 && globalThis.litPropertyMetadata.set(i5, s4 = /* @__PURE__ */ new Map()), "setter" === n5 && ((t4 = Object.create(t4)).wrapped = true), s4.set(r6.name, t4), "accessor" === n5) {
      const { name: o6 } = r6;
      return { set(r7) {
        const n6 = e5.get.call(this);
        e5.set.call(this, r7), this.requestUpdate(o6, n6, t4);
      }, init(e6) {
        return void 0 !== e6 && this.C(o6, void 0, t4, e6), e6;
      } };
    }
    if ("setter" === n5) {
      const { name: o6 } = r6;
      return function(r7) {
        const n6 = this[o6];
        e5.call(this, r7), this.requestUpdate(o6, n6, t4);
      };
    }
    throw Error("Unsupported decorator location: " + n5);
  };
  function n4(t4) {
    return (e5, o6) => "object" == typeof o6 ? r4(t4, e5, o6) : ((t5, e6, o7) => {
      const r6 = e6.hasOwnProperty(o7);
      return e6.constructor.createProperty(o7, t5), r6 ? Object.getOwnPropertyDescriptor(e6, o7) : void 0;
    })(t4, e5, o6);
  }

  // ../../node_modules/@lit/reactive-element/decorators/state.js
  function r5(r6) {
    return n4({ ...r6, state: true, attribute: false });
  }

  // src/styles.ts
  var componentStyles = i`
  :host {
    display: block;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    max-width: 900px;
    margin: 2rem auto;
    padding: 1rem;
    color: #333;
  }
  .container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }
  h1 {
    color: #1a73e8;
    margin-bottom: 0;
  }
  .controls {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    padding: 1rem;
    background: #f1f3f4;
    border-radius: 8px;
    width: 100%;
    box-sizing: border-box;
    align-items: center;
    justify-content: center;
  }
  .control-group {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  label {
    font-size: 0.8rem;
    color: #5f6368;
  }
  select, button {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    border: 1px solid #dadce0;
    font-size: 1rem;
    cursor: pointer;
  }
  button {
    background: #1a73e8;
    color: white;
    border: none;
    font-weight: 500;
  }
  button:disabled {
    background: #e0e0e0;
    cursor: not-allowed;
  }
  input[type="range"] {
    width: 150px;
  }
  .drop-zone {
    width: 100%;
    min-height: 300px;
    border: 2px dashed #dadce0;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s;
    overflow: hidden;
  }
  .drop-zone:hover {
    background-color: #f8f9fa;
    border-color: #1a73e8;
  }
  .drop-zone p {
    color: #5f6368;
    text-align: center;
  }
  .drop-zone img,
  .drop-zone canvas {
    width: 100%;
    height: auto;
    object-fit: contain;
  }
  .footer {
    width: 100%;
    text-align: center;
  }
  .status {
    min-height: 1.2em;
    color: #5f6368;
  }
  progress {
    width: 100%;
  }
  .license-info {
    font-size: 0.75rem;
    color: #5f6368;
    margin-top: 0.5rem;
    text-align: center;
  }
  .license-info a {
    color: #1a73e8;
    text-decoration: none;
  }
  .license-info a:hover {
    text-decoration: underline;
  }
  .view-original {
    margin-top: 1rem;
    background-color: #5f6368;
  }

  .comparison-container {
    position: relative;
    width: 100%;
    max-height: 100%;
    overflow: hidden;
    display: block;
    cursor: ew-resize;
    user-select: none; /* prevent text selection while dragging */
  }

  .comparison-container .comparison-img,
  .comparison-container .comparison-img-wrapper {
    display: block;
    width: 100%;
    object-fit: contain;
    pointer-events: none; /* prevent dragging image */
  }

  .comparison-container .comparison-img-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
  }

  .comparison-container .comparison-img-wrapper > canvas {
    height: 100%;
    width: 100%;
    object-fit: contain;
  }

  .comparison-container .comparison-img {
    image-rendering: pixelated;
    image-rendering: -moz-crisp-edges;
    image-rendering: crisp-edges;
  }

  .comparison-slider-bar {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 3px;
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0 0 2px rgba(0,0,0,0.5);
    transform: translateX(-50%);
    pointer-events: none;
    z-index: 1;
  }
`;

  // src/upscaler.ts
  async function upscaleImageWithTiling({
    sourceImage,
    model,
    accelerator,
    overlapPercent,
    normalizationRange,
    progressCallback
  }) {
    const inputDetails = model.getInputDetails()[0];
    const outputDetails = model.getOutputDetails()[0];
    const [, inputHeight, inputWidth] = inputDetails.shape;
    const [, outputHeight, outputWidth] = outputDetails.shape;
    const scale = outputHeight / inputHeight;
    if (outputWidth / inputWidth !== scale) {
      throw new Error(
        "Model scale factor is not consistent between height and width."
      );
    }
    progressCallback({ message: "Preparing image data...", value: 0 });
    const srcCanvas = document.createElement("canvas");
    srcCanvas.width = sourceImage.width;
    srcCanvas.height = sourceImage.height;
    const srcCtx = srcCanvas.getContext("2d");
    srcCtx.drawImage(sourceImage, 0, 0);
    const srcImageData = srcCtx.getImageData(0, 0, sourceImage.width, sourceImage.height);
    const float32Data = new Float32Array(sourceImage.width * sourceImage.height * 3);
    const [min, max] = normalizationRange;
    const scaleFactor = (max - min) / 255;
    for (let i5 = 0; i5 < srcImageData.data.length; i5 += 4) {
      const j2 = i5 / 4 * 3;
      float32Data[j2] = srcImageData.data[i5] * scaleFactor + min;
      float32Data[j2 + 1] = srcImageData.data[i5 + 1] * scaleFactor + min;
      float32Data[j2 + 2] = srcImageData.data[i5 + 2] * scaleFactor + min;
    }
    const overlapX = Math.floor(inputWidth * (overlapPercent / 100));
    const overlapY = Math.floor(inputHeight * (overlapPercent / 100));
    const stepSizeX = inputWidth - overlapX;
    const stepSizeY = inputHeight - overlapY;
    const numTilesX = sourceImage.width <= inputWidth ? 1 : Math.ceil((sourceImage.width - inputWidth) / stepSizeX) + 1;
    const numTilesY = sourceImage.height <= inputHeight ? 1 : Math.ceil((sourceImage.height - inputHeight) / stepSizeY) + 1;
    const totalTiles = numTilesX * numTilesY;
    const outCanvas = document.createElement("canvas");
    const outWidth = sourceImage.width * scale;
    const outHeight = sourceImage.height * scale;
    outCanvas.width = outWidth;
    outCanvas.height = outHeight;
    const outCtx = outCanvas.getContext("2d");
    const outImageData = outCtx.createImageData(outWidth, outHeight);
    for (let tileY = 0; tileY < numTilesY; tileY++) {
      for (let tileX = 0; tileX < numTilesX; tileX++) {
        const tileIndex = tileY * numTilesX + tileX;
        progressCallback({
          message: `Upscaling tile ${tileIndex + 1} of ${totalTiles}`,
          value: (tileIndex + 1) / totalTiles
        });
        let startX = tileX * stepSizeX;
        let startY = tileY * stepSizeY;
        if (startX + inputWidth > sourceImage.width) {
          startX = sourceImage.width - inputWidth;
        }
        if (startY + inputHeight > sourceImage.height) {
          startY = sourceImage.height - inputHeight;
        }
        const tileData = new Float32Array(inputWidth * inputHeight * 3);
        for (let y3 = 0; y3 < inputHeight; y3++) {
          for (let x2 = 0; x2 < inputWidth; x2++) {
            const srcIdx = ((startY + y3) * sourceImage.width + (startX + x2)) * 3;
            const destIdx = (y3 * inputWidth + x2) * 3;
            tileData[destIdx] = float32Data[srcIdx];
            tileData[destIdx + 1] = float32Data[srcIdx + 1];
            tileData[destIdx + 2] = float32Data[srcIdx + 2];
          }
        }
        const cpuInputTensor = new Tensor(tileData, [1, inputHeight, inputWidth, 3]);
        const inputTensor = accelerator === "webgpu" ? await cpuInputTensor.moveTo("webgpu") : cpuInputTensor;
        const [outputTensor] = await model.run([inputTensor]);
        inputTensor.delete();
        const outputCpu = accelerator === "webgpu" ? await outputTensor.moveTo("wasm") : outputTensor;
        const outputData = outputCpu.toTypedArray();
        outputCpu.delete();
        const destStartX = Math.round(startX * scale);
        const destStartY = Math.round(startY * scale);
        for (let y3 = 0; y3 < outputHeight; y3++) {
          for (let x2 = 0; x2 < outputWidth; x2++) {
            const outX = destStartX + x2;
            const outY = destStartY + y3;
            if (outX >= outWidth || outY >= outHeight) continue;
            const srcIdx = (y3 * outputWidth + x2) * 3;
            const destIdx = (outY * outWidth + outX) * 4;
            outImageData.data[destIdx] = (outputData[srcIdx] - min) / scaleFactor;
            outImageData.data[destIdx + 1] = (outputData[srcIdx + 1] - min) / scaleFactor;
            outImageData.data[destIdx + 2] = (outputData[srcIdx + 2] - min) / scaleFactor;
            outImageData.data[destIdx + 3] = 255;
          }
        }
      }
    }
    progressCallback({ message: "Finalizing image...", value: 1 });
    outCtx.putImageData(outImageData, 0, 0);
    return outCanvas;
  }

  // src/image_upscaler.ts
  var MODELS = {
    "Real-ESRGAN x4plus": {
      url: "./models/Real-ESRGAN-x4plus_float.tflite",
      licenseHtml: x`
      <div class="license-info">
        <a href="https://github.com/xinntao/Real-ESRGAN/blob/master/LICENSE" target="_blank">Model License</a>
        |
        <a href="https://huggingface.co/qualcomm/Real-ESRGAN-x4plus/blob/main/DEPLOYMENT_MODEL_LICENSE.pdf" target="_blank">Deployment License</a>
      </div>
    `,
      range: [0, 1]
      // Normalizes to [0, 1]
    }
  };
  var ImageUpscaler = class extends i4 {
    constructor() {
      super(...arguments);
      this.statusMessage = "Initializing LiteRT...";
      this.progressValue = 0;
      this.originalImage = null;
      this.originalSrc = "";
      this.originalFileName = "image";
      this.upscaledCanvas = null;
      this.isUpscaling = false;
      this.sliderValue = 50;
      this.isDraggingSlider = false;
      this.preventClick = false;
      this.comparisonContainerRect = null;
      this.dragStartX = null;
      this.models = {};
      this.selectedModelName = Object.keys(MODELS)[0];
      this.overlapPercent = 10;
      // Which accelerator each compiled model uses ('webgpu' or 'wasm').
      this.modelAccelerators = {};
      this.acceleratorPref = "auto";
      this.handleDragMove = (e5) => {
        if (!this.isDraggingSlider || !this.comparisonContainerRect) {
          return;
        }
        if (e5.buttons === 0) {
          this.stopDrag();
          return;
        }
        if (this.dragStartX !== null && Math.abs(e5.clientX - this.dragStartX) > 5) {
          this.preventClick = true;
        }
        const x2 = e5.clientX - this.comparisonContainerRect.left;
        const percent = x2 / this.comparisonContainerRect.width * 100;
        this.sliderValue = Math.max(0, Math.min(100, percent));
      };
      this.stopDrag = () => {
        this.isDraggingSlider = false;
        this.comparisonContainerRect = null;
        this.dragStartX = null;
        window.removeEventListener("mousemove", this.handleDragMove);
        window.removeEventListener("mouseup", this.stopDrag);
        setTimeout(() => {
          this.preventClick = false;
        }, 0);
      };
      this.startDrag = (e5) => {
        if (e5.button !== 0) {
          return;
        }
        e5.preventDefault();
        this.isDraggingSlider = true;
        this.preventClick = false;
        this.dragStartX = e5.clientX;
        const container = e5.currentTarget;
        this.comparisonContainerRect = container.getBoundingClientRect();
        window.addEventListener("mousemove", this.handleDragMove);
        window.addEventListener("mouseup", this.stopDrag);
      };
    }
    async firstUpdated() {
      try {
        await loadLiteRt("./wasm/");
        this.statusMessage = "Ready. Please select an image.";
        await this.loadModel(this.selectedModelName);
      } catch (e5) {
        this.statusMessage = `Error initializing LiteRT: ${e5.message}`;
        console.error(e5);
      }
    }
    async loadModel(name) {
      if (this.models[name]) return;
      this.models = { ...this.models, [name]: null };
      const modelInfo = MODELS[name];
      const accelerators = this.acceleratorPref === "webgpu" ? ["webgpu"] : this.acceleratorPref === "wasm" ? ["wasm"] : isWebGPUSupported() ? ["webgpu", "wasm"] : ["wasm"];
      let lastError = null;
      for (const accelerator of accelerators) {
        this.statusMessage = accelerator === "webgpu" ? `Downloading & compiling ${name} (GPU)...` : lastError ? `WebGPU unavailable, falling back to CPU mode...` : `Downloading & compiling ${name} (CPU)...`;
        try {
          const modelData = await this.downloadModel(modelInfo.url);
          this.statusMessage = `Compiling ${name}...`;
          const model = await loadAndCompile(modelData, { accelerator });
          this.models = { ...this.models, [name]: model };
          this.modelAccelerators = { ...this.modelAccelerators, [name]: accelerator };
          this.statusMessage = accelerator === "webgpu" ? "Ready. Please select an image." : "Ready (CPU mode \u2014 upscaling will be slower). Please select an image.";
          return;
        } catch (e5) {
          lastError = e5;
          console.error(`Failed to compile model with ${accelerator}:`, e5);
        }
      }
      this.statusMessage = `Error loading model: ${lastError.message}`;
      console.error(lastError);
    }
    /**
     * Downloads the .tflite model with a progress readout and retries.
     * Throws an actionable error if the download keeps failing.
     */
    async downloadModel(url) {
      const maxAttempts = 3;
      let lastError = null;
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          const res = await fetch(url);
          if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);
          const total = Number(res.headers.get("content-length")) || 0;
          const reader = res.body.getReader();
          const chunks = [];
          let received = 0;
          for (; ; ) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
            received += value.length;
            if (total > 0) {
              this.statusMessage = `Downloading model\u2026 ${Math.round(received / total * 100)}%` + (attempt > 1 ? ` (attempt ${attempt}/${maxAttempts})` : "");
            }
          }
          const data = new Uint8Array(received);
          let offset = 0;
          for (const c4 of chunks) {
            data.set(c4, offset);
            offset += c4.length;
          }
          return data;
        } catch (e5) {
          lastError = e5;
          console.warn(`Model download attempt ${attempt}/${maxAttempts} failed:`, e5);
          if (attempt < maxAttempts) {
            this.statusMessage = `Model download interrupted \u2014 retrying (${attempt + 1}/${maxAttempts})\u2026`;
            await new Promise((r6) => setTimeout(r6, 1500));
          }
        }
      }
      throw new Error(
        `Could not download the 67 MB model file (${lastError?.message ?? lastError}). Connect to Wi-Fi and reload to retry.`
      );
    }
    handleFileSelect(file) {
      if (!file.type.startsWith("image/")) {
        this.statusMessage = "Please select an image file.";
        return;
      }
      this.originalFileName = file.name.replace(/\.[^.]+$/, "") || "image";
      const reader = new FileReader();
      reader.onload = (e5) => {
        const img = new Image();
        img.onload = () => {
          this.originalImage = img;
          this.upscaledCanvas = null;
        };
        this.originalSrc = e5.target?.result;
        img.src = this.originalSrc;
        this.statusMessage = 'Image loaded. Click "Upscale".';
      };
      reader.readAsDataURL(file);
    }
    onDrop(e5) {
      e5.preventDefault();
      this.handleFileSelect(e5.dataTransfer?.files[0]);
    }
    onFileChange(e5) {
      const input = e5.target;
      this.handleFileSelect(input.files?.[0]);
    }
    onModelChange(e5) {
      this.selectedModelName = e5.target.value;
      this.loadModel(this.selectedModelName);
    }
    onAcceleratorChange(e5) {
      this.acceleratorPref = e5.target.value;
      this.models = { ...this.models, [this.selectedModelName]: null };
      this.loadModel(this.selectedModelName);
    }
    renderComparison() {
      return x`
      <div class="comparison-container"
           @mousedown=${this.startDrag}
      >
        <img
          class="comparison-img"
          src=${this.originalSrc}
          draggable="false"
        />
        <div class="comparison-img-wrapper" style="clip-path: inset(0 0 0 ${this.sliderValue}%)">
          ${this.upscaledCanvas}
        </div>
        <div class="comparison-slider-bar" style="left: ${this.sliderValue}%"></div>
      </div>
    `;
    }
    async handleUpscale() {
      const model = this.models[this.selectedModelName];
      const modelInfo = MODELS[this.selectedModelName];
      if (!this.originalImage || !model) {
        this.statusMessage = "Please load an image and wait for the model to compile.";
        return;
      }
      this.isUpscaling = true;
      this.upscaledCanvas = null;
      try {
        const resultCanvas = await upscaleImageWithTiling({
          sourceImage: this.originalImage,
          model,
          accelerator: this.modelAccelerators[this.selectedModelName] ?? "wasm",
          overlapPercent: this.overlapPercent,
          normalizationRange: modelInfo.range,
          progressCallback: ({ message, value }) => {
            this.statusMessage = message;
            this.progressValue = value;
          }
        });
        this.upscaledCanvas = resultCanvas;
        this.statusMessage = "Upscaling complete! Downloading\u2026";
        this.downloadUpscaledImage(resultCanvas);
      } catch (e5) {
        this.statusMessage = `Error during upscaling: ${e5.message}`;
        console.error(e5);
      } finally {
        this.isUpscaling = false;
      }
    }
    /** Auto-downloads the upscaled result as a PNG file. */
    downloadUpscaledImage(canvas) {
      canvas.toBlob((blob) => {
        if (!blob) {
          this.statusMessage = "Upscaling complete! (Could not start download.)";
          return;
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${this.originalFileName}-4x.png`;
        link.target = "_blank";
        link.rel = "noopener";
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 6e4);
      }, "image/png");
    }
    render() {
      const currentModel = this.models[this.selectedModelName];
      return x`
      <div class="container">
        <h1>🖼️ LiteRT.js Image Upscaler</h1>
        <div class="controls">
          <div class="control-group">
            <label for="model-select">Model:</label>
            <select id="model-select" @change=${this.onModelChange}>
              ${Object.keys(MODELS).map(
        (name) => x`<option .value=${name}>${name}</option>`
      )}
            </select>
            ${MODELS[this.selectedModelName]?.licenseHtml ?? ""}
          </div>
          <div class="control-group">
            <label for="accelerator-select">Processor:</label>
            <select id="accelerator-select" @change=${this.onAcceleratorChange}>
              <option value="auto">Auto (GPU if available)</option>
              <option value="webgpu" .disabled=${!isWebGPUSupported()}>
                GPU (WebGPU)
              </option>
              <option value="wasm">CPU</option>
            </select>
          </div>
          <div class="control-group">
            <label for="overlap-slider">Tile Overlap: ${this.overlapPercent}%</label>
            <input
              type="range"
              id="overlap-slider"
              min="0"
              max="50"
              .value=${`${this.overlapPercent}`}
              @input=${(e5) => this.overlapPercent = Number(e5.target.value)}>
          </div>
          <button @click=${this.handleUpscale} .disabled=${!this.originalImage || !currentModel || this.isUpscaling}>
            ${this.isUpscaling ? "Upscaling..." : "\u{1F680} Upscale"}
          </button>
        </div>

        <div
          class="drop-zone"
          @dragover=${(e5) => e5.preventDefault()}
          @drop=${this.onDrop}
          @click=${() => {
        if (this.preventClick) return;
        this.shadowRoot?.querySelector("#file-input")?.click();
      }}
        >
          ${this.upscaledCanvas && this.originalSrc ? this.renderComparison() : this.originalSrc ? x`
            <img src=${this.originalSrc} alt="display image" />
          ` : x`
            <p>Drag & Drop an Image Here, or Click to Select</p>
          `}
          <input type="file" id="file-input" @change=${this.onFileChange} accept="image/*" hidden>
        </div>

        <div class="footer">
          <p class="status">${this.statusMessage}</p>
          ${this.isUpscaling ? x`<progress max="1" .value=${this.progressValue}></progress>` : ""}
        </div>
      </div>
    `;
    }
  };
  ImageUpscaler.styles = componentStyles;
  __decorateClass([
    r5()
  ], ImageUpscaler.prototype, "statusMessage", 2);
  __decorateClass([
    r5()
  ], ImageUpscaler.prototype, "progressValue", 2);
  __decorateClass([
    r5()
  ], ImageUpscaler.prototype, "originalImage", 2);
  __decorateClass([
    r5()
  ], ImageUpscaler.prototype, "originalSrc", 2);
  __decorateClass([
    r5()
  ], ImageUpscaler.prototype, "originalFileName", 2);
  __decorateClass([
    r5()
  ], ImageUpscaler.prototype, "upscaledCanvas", 2);
  __decorateClass([
    r5()
  ], ImageUpscaler.prototype, "isUpscaling", 2);
  __decorateClass([
    r5()
  ], ImageUpscaler.prototype, "sliderValue", 2);
  __decorateClass([
    r5()
  ], ImageUpscaler.prototype, "isDraggingSlider", 2);
  __decorateClass([
    r5()
  ], ImageUpscaler.prototype, "preventClick", 2);
  __decorateClass([
    r5()
  ], ImageUpscaler.prototype, "models", 2);
  __decorateClass([
    r5()
  ], ImageUpscaler.prototype, "selectedModelName", 2);
  __decorateClass([
    r5()
  ], ImageUpscaler.prototype, "overlapPercent", 2);
  __decorateClass([
    r5()
  ], ImageUpscaler.prototype, "acceleratorPref", 2);
  ImageUpscaler = __decorateClass([
    t3("image-upscaler")
  ], ImageUpscaler);
})();
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
lit-html/lit-html.js:
lit-element/lit-element.js:
@lit/reactive-element/decorators/custom-element.js:
@lit/reactive-element/decorators/property.js:
@lit/reactive-element/decorators/state.js:
@lit/reactive-element/decorators/event-options.js:
@lit/reactive-element/decorators/base.js:
@lit/reactive-element/decorators/query.js:
@lit/reactive-element/decorators/query-all.js:
@lit/reactive-element/decorators/query-async.js:
@lit/reactive-element/decorators/query-assigned-nodes.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-elements.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
//# sourceMappingURL=_demo_bin.js.map
