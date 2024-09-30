<template>
  <div>
    <q-btn
      label="AGREGAR"
      icon="add"
      color="primary"
      @click="openModal"
      rounded
    />
    <q-dialog
      v-model="dialog"
      persistent
    >
      <q-card style="width: 800px; max-width: 60vw;">
        <q-form
          @submit="save"
          @reset="onReset"
          class=""
          ref="seguimientoForm"
        >
          <q-card-section class="q-gutter-md">
            <div class="text-h6 text-bold text-primary">
              <q-icon name="timeline" />
              {{ seguimiento.etapaDenuncia == patrocinioId
                ? 'PATROCINIO'
                : seguimiento.etapaDenuncia == orientacionId
                ? 'ORIENTACIÓN'
                : seguimiento.etapaDenuncia == socialId
                ? 'TRABAJO SOCIAL'
                : seguimiento.etapaDenuncia == psicologiaId
                ? 'PSICOLOGÍA'
                : ''
              }}
            </div>
          </q-card-section>
          <q-card-section>
            <div class="row q-col-gutter-md">
              <div class="col-xs-12 col-md-6">
                <q-input
                  v-model="seguimiento.fechaInicio"
                  label="Fecha de inicio"
                  class="q-pb-md"
                  filled
                  name="fechaInicio"
                  type="date"
                  :rules="requiredRule"
                />
              </div>
              <div class="col-xs-12 col-md-6">
                <q-input
                  v-model="seguimiento.fechaFin"
                  label="Fecha estimada de finalización de la tarea"
                  class="q-pb-md"
                  filled
                  name="fechaFin"
                  type="date"
                  :rules="requiredRule"
                />
              </div>
              <div class="col-12">
                <q-select
                  v-model="seguimiento.etapaDenuncia"
                  :options="optionEtapas"
                  label="Estado de Intervencion Profesional"
                  class="q-pb-md"
                  filled
                  option-label="nombre"
                  option-value="nombre"
                  emit-value
                  map-options
                  :rules="requiredRule"
                />
              </div>
              <div class="col-12" v-if="seguimiento.etapaDenuncia">
                <q-select
                  v-model="seguimiento.participantes"
                  :options="participantes"
                  label="Participantes"
                  class="q-pb-md"
                  filled
                  use-chips
                  multiple
                  option-label="nombreCompleto"
                  option-value="id"
                  emit-value
                  map-options
                />
              </div>
              <div class="col-12" v-if="seguimiento.etapaDenuncia == patrocinioId">
                <q-select
                  v-model="seguimiento.idEtapaProcesal"
                  :options="etapaProcesalOpciones"
                  label="Etapa Procesal (Patrocinio)"
                  class="q-pb-md"
                  filled
                  option-label="nombre"
                  option-value="id"
                  emit-value
                  map-options
                  :rules="requiredRule"
                />
              </div>

              <div class="col-12" v-if="seguimiento.etapaDenuncia == patrocinioId && seguimiento.idEtapaProcesal == preliminarId">
                <div class="row justify">
                  <div class="col-12">
                    <div class="text-h6 text-bold text-primary">
                      PRELIMINAR
                    </div>
                  </div>
                  <div
                    class="col-12"
                    v-for="preliminar in optionPreliminarcheck"
                    :key="preliminar.id"
                  >
                    <q-checkbox
                      v-model="preliminarCheck[preliminar.id]"
                      :label="preliminar.nombre"
                      :value="preliminar.id"
                    ></q-checkbox>
                  </div>
                  <div class="col-12">
                    <q-input
                      v-model="seguimiento.fechaPreliminar"
                      label="Fecha Situación Jurídica Preliminar"
                      class="q-pb-md"
                      filled
                      name="fechaPreliminar"
                      type="date"
                      :rules="requiredRule"
                    />
                  </div>
                </div>
              </div>

              <div class="col-12" v-if="seguimiento.etapaDenuncia == patrocinioId && seguimiento.idEtapaProcesal == rechazoObjecionId">
                <div class="row q-col-gutter-md">
                  <div class="col-12">
                    <div class="text-h6 text-bold text-primary">
                      RECHAZO CON OBJECIÓN
                    </div>
                  </div>
                  <div class="col-xs-12 col-md-6">
                    <q-input
                      v-model="seguimiento.fechaRechazoCon"
                      label="Fecha del rechazo con objeción"
                      class="q-pb-md"
                      filled
                      name="fechaRechazoCon"
                      type="date"
                    />
                  </div>
                  <div class="col-xs-12 col-md-6">
                    <q-input
                      v-model="seguimiento.numeroResolucion"
                      label="N° de resolución jerárquica"
                      class="q-pb-md"
                      filled
                      name="numeroResolucion"
                      type="text"
                    />
                  </div>
                </div>
              </div>

              <div class="col-12" v-if="seguimiento.etapaDenuncia == patrocinioId && seguimiento.idEtapaProcesal == rechazoSinObjecionId">
                <div class="row q-col-gutter-md">
                  <div class="col-12">
                    <div class="text-h6 text-bold text-primary">
                      RECHAZO SIN OBJECIÓN
                    </div>
                  </div>
                  <div class="col-12">
                    <q-input
                      v-model="seguimiento.fechaRechazoSin"
                      label="Fecha del rechazo sin objeción"
                      class="q-pb-md"
                      filled
                      name="fechaRechazoSin"
                      type="date"
                    />
                  </div>
                </div>
              </div>

              <div class="col-12" v-if="seguimiento.etapaDenuncia == patrocinioId && seguimiento.idEtapaProcesal == preparatoriaImputacionId">
                <div class="row justify">
                  <div class="col-12">
                    <div class="text-h6 text-bold text-primary">
                      IMPUTACIÓN
                    </div>
                  </div>
                  <div
                    class="col-12"
                    v-for="preparatoria in optionPreparatoriacheck"
                    :key="preparatoria.id"
                  >
                    <q-checkbox
                      v-model="preparatoriaCheck[preparatoria.id]"
                      :label="preparatoria.nombre"
                      :value="preparatoria.id"
                    ></q-checkbox>
                  </div>
                  <div class="col-12" v-if="slim">
                    <q-select
                      v-model="seguimiento.idDelitoImputacion"
                      :options="slimTipologias"
                      label="Delito por el que se ha imputado"
                      class="q-pb-md"
                      filled
                      option-label="nombre"
                      option-value="id"
                      emit-value
                      map-options
                      clearable
                    />
                  </div>
                  <div class="col-12" v-else>
                    <q-select
                      v-model="seguimiento.idDelitoImputacion"
                      :options="defensoriaTipologias"
                      label="Delito por el que se ha imputado"
                      class="q-pb-md"
                      filled
                      option-label="nombre"
                      option-value="id"
                      emit-value
                      map-options
                      clearable
                    />
                  </div>
                  <div class="col-xs-12 col-md-6">
                    <q-input
                      v-model="seguimiento.fechaImputacion"
                      label="Fecha de la imputación"
                      class="q-pb-md"
                      filled
                      name="fechaImputacion"
                      type="date"
                    />
                  </div>
                  <div class="col-xs-12 col-md-6">
                    <q-input
                      v-model="seguimiento.fechaMedidaCautelar"
                      label="Fecha de audiencia de medida cautelar"
                      class="q-pb-md"
                      filled
                      name="fechaMedidaCautelar"
                      type="date"
                    />
                  </div>
                  <div class="col-12">
                    <q-input
                      v-model="seguimiento.fechaAudiencia"
                      label="Fecha de audiencia de situación jurídica del imputado"
                      class="q-pb-md"
                      filled
                      name="fechaAudiencia"
                      type="date"
                    />
                  </div>
                  <div class="col-12">
                    <q-select
                      v-model="seguimiento.idMedidaCautelar"
                      :options="medidaCautelarOpciones"
                      label="Medida cautelar de cararter personal"
                      class="q-pb-md"
                      filled
                      option-label="nombre"
                      option-value="id"
                      emit-value
                      map-options
                      clearable
                    />
                  </div>
                  <div class="col-xs-12 col-md-6">
                    <q-input
                      v-model="seguimiento.mesesDetencion"
                      label="Meses de la detención"
                      class="q-pb-md"
                      filled
                      name="mesesDetencion"
                      type="number"
                    />
                  </div>
                  <div class="col-xs-12 col-md-6">
                    <q-input
                      v-model="seguimiento.mesesAmpliacion"
                      label="Ampliación de la detención en meses"
                      class="q-pb-md"
                      filled
                      name="mesesAmpliacion"
                      type="number"
                    />
                  </div>
                </div>
              </div>

              <div class="col-12" v-if="seguimiento.etapaDenuncia == patrocinioId && seguimiento.idEtapaProcesal == sobreseimientoImpugnacionId">
                <div class="row q-col-gutter-md">
                  <div class="col-12">
                    <div class="text-h6 text-bold text-primary">
                      SOBRESEIMIENTO CON IMPUGNACIÓN
                    </div>
                  </div>
                  <div class="col-12" v-if="slim">
                    <q-select
                      v-model="seguimiento.idDelitoConImpugnacion"
                      :options="slimTipologias"
                      label="Delito por el que se ha sobreseido"
                      class="q-pb-md"
                      filled
                      option-label="nombre"
                      option-value="id"
                      emit-value
                      map-options
                      clearable
                    />
                  </div>
                  <div class="col-12" v-else>
                    <q-select
                      v-model="seguimiento.idDelitoConImpugnacion"
                      :options="defensoriaTipologias"
                      label="Delito por el que se ha sobreseido"
                      class="q-pb-md"
                      filled
                      option-label="nombre"
                      option-value="id"
                      emit-value
                      map-options
                      clearable
                    />
                  </div>
                  <div class="col-xs-12 col-md-6">
                    <q-input
                      v-model="seguimiento.fechaConImpugnacion"
                      label="Fecha del sobreseimiento con impugnación"
                      class="q-pb-md"
                      filled
                      name="fechaConImpugnacion"
                      type="date"
                    />
                  </div>
                  <div class="col-xs-12 col-md-6">
                    <q-input
                      v-model="seguimiento.numeroResolucionConImpugnacion"
                      label="N° de resolución jerárquica"
                      class="q-pb-md"
                      filled
                      name="numeroResolucionConImpugnacion"
                      type="text"
                    />
                  </div>
                </div>
              </div>

              <div class="col-12" v-if="seguimiento.etapaDenuncia == patrocinioId && seguimiento.idEtapaProcesal == sobreseimientoSinImpugnacionId">
                <div class="row q-col-gutter-md">
                  <div class="col-12">
                    <div class="text-h6 text-bold text-primary">
                      SOBRESEIMIENTO SIN IMPUGNACIÓN
                    </div>
                  </div>
                  <div class="col-12" v-if="slim">
                    <q-select
                      v-model="seguimiento.idDelitoSinImpugnacion"
                      :options="slimTipologias"
                      label="Delito por el que se ha sobreseido"
                      class="q-pb-md"
                      filled
                      option-label="nombre"
                      option-value="id"
                      emit-value
                      map-options
                      clearable
                    />
                  </div>
                  <div class="col-12" v-else>
                    <q-select
                      v-model="seguimiento.idDelitoSinImpugnacion"
                      :options="defensoriaTipologias"
                      label="Delito por el que se ha sobreseido"
                      class="q-pb-md"
                      filled
                      option-label="nombre"
                      option-value="id"
                      emit-value
                      map-options
                      clearable
                    />
                  </div>
                  <div class="col-xs-12 col-md-6">
                    <q-input
                      v-model="seguimiento.fechaSinImpugnacion"
                      label="Fecha del sobreseimiento sin impugnación"
                      class="q-pb-md"
                      filled
                      name="fechaSinImpugnacion"
                      type="date"
                    />
                  </div>
                  <div class="col-xs-12 col-md-6">
                    <q-input
                      v-model="seguimiento.numeroResolucionSinImpugnacion"
                      label="Motivo de la no impugnación"
                      class="q-pb-md"
                      filled
                      name="numeroResolucionSinImpugnacion"
                      type="text"
                    />
                  </div>
                </div>
              </div>

              <div class="col-12" v-if="seguimiento.etapaDenuncia == patrocinioId && seguimiento.idEtapaProcesal == acusacionId">
                <div class="row q-col-gutter-md">
                  <div class="col-12">
                    <div class="text-h6 text-bold text-primary">
                      ACUSACIÓN
                    </div>
                  </div>
                  <div class="col-12">
                    <q-input
                      v-model="seguimiento.fechaAcusacionFiscal"
                      label="Fecha de la acusación Fiscal"
                      class="q-pb-md"
                      filled
                      name="fechaAcusacionFiscal"
                      type="date"
                    />
                  </div>
                  <div class="col-12">
                    <q-input
                      v-model="seguimiento.fechaAcusacionParticular"
                      label="Fecha de la acusación Particular"
                      class="q-pb-md"
                      filled
                      name="fechaAcusacionParticular"
                      type="date"
                    />
                  </div>
                  <div class="col-12">
                    <q-input
                      v-model="seguimiento.fechaAcusacionDefensorias"
                      label="Fecha de la acusación de Las Defensorias de la niñez y Adolecencia"
                      class="q-pb-md"
                      filled
                      name="fechaAcusacionDefensorias"
                      type="date"
                    />
                  </div>
                </div>
              </div>

              <div class="col-12" v-if="seguimiento.etapaDenuncia == patrocinioId && seguimiento.idEtapaProcesal == juicioOralId">
                <div class="row q-col-gutter-md">
                  <div class="col-12">
                    <div class="text-h6 text-bold text-primary">
                      JUICIO ORAL
                    </div>
                  </div>
                  <div class="col-12">
                    <q-input
                      v-model="seguimiento.fechaJuicioOral"
                      label="Fecha de apertura de juicio oral"
                      class="q-pb-md"
                      filled
                      name="fechaJuicioOral"
                      type="date"
                    />
                  </div>
                </div>
              </div>

              <div class="col-12" v-if="seguimiento.etapaDenuncia == patrocinioId && seguimiento.idEtapaProcesal == sentenciaAbsolutoriaId">
                <div class="row q-col-gutter-md">
                  <div class="col-12">
                    <div class="text-h6 text-bold text-primary">
                      SENTENCIA ABSOLUTORIA
                    </div>
                  </div>
                  <div class="col-12" v-if="slim">
                    <q-select
                      v-model="seguimiento.idDelitoSentenciaAbsolutoria"
                      :options="slimTipologias"
                      label="Delito por el que se ha absuelto"
                      class="q-pb-md"
                      filled
                      option-label="nombre"
                      option-value="id"
                      emit-value
                      map-options
                      clearable
                    />
                  </div>
                  <div class="col-12" v-else>
                    <q-select
                      v-model="seguimiento.idDelitoSentenciaAbsolutoria"
                      :options="defensoriaTipologias"
                      label="Delito por el que se ha absuelto"
                      class="q-pb-md"
                      filled
                      option-label="nombre"
                      option-value="id"
                      emit-value
                      map-options
                      clearable
                    />
                  </div>
                  <div class="col-xs-12 col-md-6">
                    <q-input
                      v-model="seguimiento.fechaSentAbsolutoria"
                      label="Fecha de la sentencia"
                      class="q-pb-md"
                      filled
                      name="fechaSentAbsolutoria"
                      type="date"
                    />
                  </div>
                  <div class="col-xs-12 col-md-6">
                    <q-input
                      v-model="seguimiento.numeroSentencia"
                      label="N° de sentencia"
                      class="q-pb-md"
                      filled
                      name="numeroSentencia"
                      type="text"
                    />
                  </div>
                  <div class="col-xs-12 col-md-6">
                    <q-select
                      v-model="seguimiento.idPresentoSentAbsolutoria"
                      :options="sePresentoOpciones"
                      label="¿Se presentó?"
                      class="q-pb-md"
                      filled
                      option-label="nombre"
                      option-value="id"
                      emit-value
                      map-options
                      clearable
                    />
                  </div>
                  <div class="col-xs-12 col-md-6">
                    <q-input
                      v-model="seguimiento.recursoSentAbsolutoria"
                      label="Recurso de apelación restringida"
                      class="q-pb-md"
                      filled
                      name="recursoSentAbsolutoria"
                      type="text"
                    />
                  </div>
                </div>
              </div>

              <div class="col-12" v-if="seguimiento.etapaDenuncia == patrocinioId && seguimiento.idEtapaProcesal == sentenciaCondenatoriaId">
                <div class="row q-col-gutter-md">
                  <div class="col-12">
                    <div class="text-h6 text-bold text-primary">
                      SENTENCIA CONDENATORIA
                    </div>
                  </div>
                  <div class="col-12" v-if="slim">
                    <q-select
                      v-model="seguimiento.idDelitoSentenciaCondenatoria"
                      :options="slimTipologias"
                      label="Delito por el que se ha condenado"
                      class="q-pb-md"
                      filled
                      option-label="nombre"
                      option-value="id"
                      emit-value
                      map-options
                      clearable
                    />
                  </div>
                  <div class="col-12" v-else>
                    <q-select
                      v-model="seguimiento.idDelitoSentenciaCondenatoria"
                      :options="defensoriaTipologias"
                      label="Delito por el que se ha condenado"
                      class="q-pb-md"
                      filled
                      option-label="nombre"
                      option-value="id"
                      emit-value
                      map-options
                      clearable
                    />
                  </div>
                  <div class="col-xs-12 col-md-3">
                    <q-input
                      v-model="seguimiento.fechaSentencia"
                      label="Fecha de la sentencia"
                      class="q-pb-md"
                      filled
                      name="fechaSentencia"
                      type="date"
                    />
                  </div>
                  <div class="col-xs-12 col-md-3">
                    <q-input
                      v-model="seguimiento.aniosSentencia"
                      label="Años de sentencia"
                      class="q-pb-md"
                      filled
                      name="aniosSentencia"
                      type="number"
                    />
                  </div>
                  <div class="col-xs-12 col-md-3">
                    <q-input
                      v-model="seguimiento.mesesSentencia"
                      label="Meses de sentencia"
                      class="q-pb-md"
                      filled
                      name="mesesSentencia"
                      type="number"
                    />
                  </div>
                  <div class="col-xs-12 col-md-3">
                    <q-input
                      v-model="seguimiento.diasMulta"
                      label="Días de multa"
                      class="q-pb-md"
                      filled
                      name="diasMulta"
                      type="number"
                    />
                  </div>
                  <div class="col-12">
                    <q-select
                      v-model="seguimiento.idPenal"
                      :options="penales"
                      label="Penal donde se esta cumpliendo la sentencia"
                      class="q-pb-md"
                      filled
                      option-label="nombre"
                      option-value="id"
                      emit-value
                      map-options
                      clearable
                    />
                  </div>
                </div>
              </div>

              <div class="col-12" v-if="seguimiento.etapaDenuncia == patrocinioId && seguimiento.idEtapaProcesal == sentenciaMixtaId">
                <div class="row q-col-gutter-md">
                  <div class="col-12">
                    <div class="text-h6 text-bold text-primary">
                      SENTENCIA MIXTA
                    </div>
                  </div>
                  <div class="col-12" v-if="slim">
                    <q-select
                      v-model="seguimiento.idDelitoSentenciaCondenatoriaMixta"
                      :options="slimTipologias"
                      label="Delito por el que se ha condenado"
                      class="q-pb-md"
                      filled
                      option-label="nombre"
                      option-value="id"
                      emit-value
                      map-options
                      clearable
                    />
                  </div>
                  <div class="col-12" v-else>
                    <q-select
                      v-model="seguimiento.idDelitoSentenciaCondenatoriaMixta"
                      :options="defensoriaTipologias"
                      label="Delito por el que se ha condenado"
                      class="q-pb-md"
                      filled
                      option-label="nombre"
                      option-value="id"
                      emit-value
                      map-options
                      clearable
                    />
                  </div>
                  <div class="col-12" v-if="slim">
                    <q-select
                      v-model="seguimiento.idDelitoSentenciaAbsolutoriaMixta"
                      :options="slimTipologias"
                      label="Delito por el que se ha absuelto"
                      class="q-pb-md"
                      filled
                      option-label="nombre"
                      option-value="id"
                      emit-value
                      map-options
                      clearable
                    />
                  </div>
                  <div class="col-12" v-else>
                    <q-select
                      v-model="seguimiento.idDelitoSentenciaAbsolutoriaMixta"
                      :options="defensoriaTipologias"
                      label="Delito por el que se ha absuelto"
                      class="q-pb-md"
                      filled
                      option-label="nombre"
                      option-value="id"
                      emit-value
                      map-options
                      clearable
                    />
                  </div>
                  <div class="col-12">
                    <q-input
                      v-model="seguimiento.fechaSentMixta"
                      label="Fecha de sentencia mixta"
                      class="q-pb-md"
                      filled
                      name="fechaSentMixta"
                      type="date"
                    />
                  </div>
                </div>
              </div>

              <div class="col-12" v-if="seguimiento.etapaDenuncia == patrocinioId && seguimiento.idEtapaProcesal == recursoId">
                <div class="row q-col-gutter-md">
                  <div class="col-12">
                    <div class="text-h6 text-bold text-primary">
                      RECURSO
                    </div>
                  </div>
                  <div class="col-xs-12 col-md-6">
                    <q-input
                      v-model="seguimiento.fechaPlanteamiento"
                      label="Fecha de planteamiento del recurso"
                      class="q-pb-md"
                      filled
                      name="fechaPlanteamiento"
                      type="date"
                    />
                  </div>
                  <div class="col-xs-12 col-md-6">
                    <q-input
                      v-model="seguimiento.fechaNotificacion"
                      label="Fecha de notificación del recurso"
                      class="q-pb-md"
                      filled
                      name="fechaNotificacion"
                      type="date"
                    />
                  </div>
                </div>
              </div>

              <div class="col-12" v-if="seguimiento.etapaDenuncia == patrocinioId && seguimiento.idEtapaProcesal == ejecucionId">
                <div class="row q-col-gutter-md">
                  <div class="col-12">
                    <div class="text-h6 text-bold text-primary">
                      EJECUCIÓN
                    </div>
                  </div>
                  <div class="col-12">
                    <q-input
                      v-model="seguimiento.autoInterlocutorio"
                      type="textarea"
                      label="Auto interlocutorio de ejecución de sentencia"
                      class="q-pb-md"
                      filled
                      name="autoInterlocutorio"
                      autogrow
                    />
                  </div>
                </div>
              </div>

              <div class="col-12">
                <q-input
                  v-model="seguimiento.actuacion"
                  type="textarea"
                  label="Actuacion"
                  class="q-pb-md"
                  filled
                  autogrow
                  :rules="requiredRule"
                />
              </div>
              <div class="col-12" v-if="seguimiento.etapaDenuncia != patrocinioId">
                <q-input
                  v-model="seguimiento.fechaActuacion"
                  stack-label
                  type="date"
                  label="Fecha Actuacion"
                  class="q-pb-md"
                  filled
                  :rules="requiredRule"
                />
              </div>
              <div class="col-12">
                <div
                  class="row q-pb-md"
                  v-for="(archivo,index) in seguimiento.archivos"
                  :key="index"
                >
                  <div class="col-5">
                    <q-uploader
                      ref="uploader"
                      :factory="factoryFn"
                      label="Adjuntar archivo maximo 300Mb"
                      color="primary"
                      text-color="white"
                      style="width:100%"
                      auto-upload
                      :max-file-size="104857600"
                      @rejected="onRejected"
                      @uploaded="archivos"
                      @start="seleccionArchivo(archivo)"
                    />
                  </div>
                  <div class="col-6">
                    <q-input
                      v-model="archivo.descripcion"
                      type="textarea"
                      label="Descripcion archivo adjunto"
                      class="q-pb-md q-px-md"
                      filled
                      rows="4"
                      :rules="requiredRule"
                    >
                      <template v-slot:prepend>
                        <q-icon name="draw" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-1">
                    <q-btn
                      flat
                      round
                      color="negative"
                      icon="delete"
                      @click="eliminarArchivo(index)"
                    />
                  </div>
                </div>
                <div class="col-xs-12 text-center">
                  <q-btn
                    outline
                    rounded
                    color="primary"
                    icon="add"
                    label="Añadir Adjunto"
                    @click="aniadirArchivo"
                  />

                </div>
              </div>
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              flat
              label="Cancelar"
              color="primary"
              v-close-popup
            />
            <q-btn
              label="Guardar"
              color="primary"
              @click="save"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import validaciones from '@common/validations'
import { mapState } from 'vuex'
export default {
  props: {
    proceso: String,
    denuncia: String,
    slim: Object,
    defensoria: Object,
    etapas: {
      type: Array,
      default: () => []
    },
    checksPreliminar: {
      type: Array,
      default: () => []
    },
    checksPreparatoria: {
      type: Array,
      default: () => []
    },
    estado: String
  },
  data () {
    return {
      optionEtapas: this.etapas,
      dialog: false,
      seguimiento: {
        // datos generales
        fechaInicio: null,
        fechaFin: null,
        participantes: [],
        etapaDenuncia: null,
        actuacion: null,
        fechaActuacion: null,
        rolActual: null,
        archivos: [],
        // patrocinio data
        idEtapaProcesal: null,
        // preliminar
        fechaPreliminar: null,
        // con objecion
        fechaRechazoCon: null,
        numeroResolucion: null,
        // sin objecion
        fechaRechazoSin: null,
        // imputacion
        idDelitoImputacion: null,
        fechaImputacion: null,
        fechaMedidaCautelar: null,
        fechaAudiencia: null,
        idMedidaCautelar: null,
        mesesDetencion: null,
        mesesAmpliacion: null,
        // sobreseimiento impugnacion
        idDelitoConImpugnacion: null,
        fechaConImpugnacion: null,
        numeroResolucionConImpugnacion: null,
        // sobreseimiento sin impugnacion
        idDelitoSinImpugnacion: null,
        fechaSinImpugnacion: null,
        numeroResolucionSinImpugnacion: null,
        // acusacion
        fechaAcusacionFiscal: null,
        fechaAcusacionParticular: null,
        fechaAcusacionDefensorias: null,
        // juicio oral
        fechaJuicioOral: null,
        // sentencia absolutoria
        idDelitoSentenciaAbsolutoria: null,
        fechaSentAbsolutoria: null,
        numeroSentencia: null,
        idPresentoSentAbsolutoria: null,
        recursoSentAbsolutoria: null,
        // condenatoria
        idDelitoSentenciaCondenatoria: null,
        fechaSentencia: null,
        aniosSentencia: null,
        mesesSentencia: null,
        diasMulta: null,
        idPenal: null,
        // mixto
        idDelitoSentenciaCondenatoriaMixta: null,
        idDelitoSentenciaAbsolutoriaMixta: null,
        fechaSentMixta: null,
        // recurso
        fechaPlanteamiento: null,
        fechaNotificacion: null,
        // ejecucion
        autoInterlocutorio: null,
        // se atendio
        seAtendio: false
      },
      checkPreliminar: [],
      /* patrocinioId: 'd818733a-7f42-4ec1-b000-726fa916f612',
      orientacionId: 'd9a0e6e6-4729-4ddc-ab87-15e8d5869330',
      psicologiaId: '6d63a2b7-8ef5-4817-8f4a-725ce5ccdd0d',
      socialId: 'cd7a77f0-e105-47c5-88af-e2d2d772f178', */
      patrocinioId: null,
      orientacionId: null,
      psicologiaId: null,
      socialId: null,
      preliminarId: null,
      rechazoObjecionId: null,
      rechazoSinObjecionId: null,
      preparatoriaImputacionId: null,
      sobreseimientoImpugnacionId: null,
      sobreseimientoSinImpugnacionId: null,
      acusacionId: null,
      juicioOralId: null,
      sentenciaAbsolutoriaId: null,
      sentenciaCondenatoriaId: null,
      sentenciaMixtaId: null,
      recursoId: null,
      ejecucionId: null,
      archivoSeleccionado: null,
      requiredRule: [validaciones.requerido],
      defensoriaTipologias: [],
      slimTipologias: [],
      participantes: [],
      etapaProcesalOpciones: [],
      medidaCautelarOpciones: [],
      sePresentoOpciones: [],
      penales: [],
      optionPreliminarcheck: [],
      optionPreparatoriacheck: [],
      preliminarCheck: {},
      preparatoriaCheck: {}
    }
  },
  async mounted () {
    const {
      patrocinioId,
      orientacionId,
      psicologiaId,
      socialId,
      preliminarId,
      rechazoObjecionId,
      rechazoSinObjecionId,
      preparatoriaImputacionId,
      sobreseimientoImpugnacionId,
      sobreseimientoSinImpugnacionId,
      acusacionId,
      juicioOralId,
      sentenciaAbsolutoriaId,
      sentenciaCondenatoriaId,
      sentenciaMixtaId,
      recursoId,
      ejecucionId
    } = await this.$axios.get(`/system/parametros/procesos/ids?idProceso=${this.proceso}`)

    this.orientacionId = orientacionId
    this.patrocinioId = patrocinioId
    this.psicologiaId = psicologiaId
    this.socialId = socialId
    this.preliminarId = preliminarId
    this.rechazoObjecionId = rechazoObjecionId
    this.rechazoSinObjecionId = rechazoSinObjecionId
    this.rechazoSinObjecionId = rechazoSinObjecionId
    this.preparatoriaImputacionId = preparatoriaImputacionId
    this.sobreseimientoImpugnacionId = sobreseimientoImpugnacionId
    this.sobreseimientoSinImpugnacionId = sobreseimientoSinImpugnacionId
    this.acusacionId = acusacionId
    this.juicioOralId = juicioOralId
    this.sentenciaAbsolutoriaId = sentenciaAbsolutoriaId
    this.sentenciaCondenatoriaId = sentenciaCondenatoriaId
    this.sentenciaMixtaId = sentenciaMixtaId
    this.recursoId = recursoId
    this.ejecucionId = ejecucionId

    // this.etapasModel = await this.$axios.get(`/system/parametros?grupo=ETAPA_CASO&grupo=ETAPA_CASO_SLIM&idProceso=${this.proceso}`).then(({ rows }) => rows)
    this.defensoriaTipologias = await this.$axios.get(`/system/parametros?grupo=DELITO_GAMEA&idProceso=${this.proceso}`).then(({ rows }) => rows)
    this.slimTipologias = await this.$axios.get(`/system/parametros?grupo=DELITO_GAMEA_SLIM&idProceso=${this.proceso}`).then(({ rows }) => rows)
    this.participantes = await this.$axios.get(`denuncias/participante/atributos?idDenuncia=${this.denuncia}&idProceso=${this.proceso}`).then(({ rows }) => rows)
    this.etapaProcesalOpciones = await this.$axios.get(`/system/parametros?grupo=ETAPA_PROCESAL_GAMEA&grupo=ETAPA_PROCESAL_SLIM&idProceso=${this.proceso}`).then(({ rows }) => rows)
    this.medidaCautelarOpciones = await this.$axios.get(`/system/parametros?grupo=MEDIDA_CAUTELAR_GAMEA&grupo=MEDIDA_CAUTELAR_SLIM&idProceso=${this.proceso}`).then(({ rows }) => rows)
    this.sePresentoOpciones = await this.$axios.get(`/system/parametros?grupo=PRESENTO&grupo=PRESENTO_SLIM&idProceso=${this.proceso}`).then(({ rows }) => rows)
    this.penales = await this.$axios.get(`/system/parametros?grupo=PENAL_GAMEA&grupo=PENAL_GAMEA_SLIM&idProceso=${this.proceso}`).then(({ rows }) => rows)
    this.optionPreliminarcheck = await this.$axios.get(`/system/parametros?grupo=CHECK_PRELIMINAR_DEFENSORIA&grupo=CHECK_PRELIMINAR_SLIM&idProceso=${this.proceso}`).then(({ rows }) => rows)
    this.optionPreparatoriacheck = await this.$axios.get(`/system/parametros?grupo=CHECK_PREPARATORIA_SLIM&grupo=CHECK_PREPARATORIA_DEFENSORIA&idProceso=${this.proceso}`).then(({ rows }) => rows)
    this.setValores()
  },
  computed: {
    ...mapState(['global'])
  },
  methods: {
    onRejected (value) {
      this.$alert.warning('ERROR: No puede adjuntar archivos de mas de 300 MB.')
    },
    setValores () {
      for (let z = 0; z < this.optionPreliminarcheck.length; z++) {
        const elm = this.optionPreliminarcheck[z]
        const find = this.checksPreliminar.find(dat => { return dat.id === elm.id })
        if (find) {
          this.preliminarCheck[find.id] = true
        }
      }
      for (let z = 0; z < this.optionPreparatoriacheck.length; z++) {
        const elm = this.optionPreparatoriacheck[z]
        const find = this.checksPreparatoria.find(dat => { return dat.id === elm.id })
        if (find) {
          this.preparatoriaCheck[find.id] = true
        }
      }
    },
    limpiarForm () {
      this.seguimiento = {
        etapaDenuncia: null,
        actuacion: null,
        fechaActuacion: null,
        archivos: []
      }
    },
    openModal () {
      this.limpiarForm()
      this.dialog = true
    },
    async save () {
      try {
        this.formatearFormulario()
        if (await this.$refs.seguimientoForm.validate()) {
          this.seguimiento.idDenuncia = this.denuncia
          this.seguimiento.estadoDenuncia = this.estado
          this.seguimiento.rolActual = this.global.rolactual.id
          await this.$axios.post('denuncias/seguimiento', this.seguimiento)
          this.$emit('nuevoSeguimiento')
          this.dialog = false
          this.$refs.seguimientoForm.reset()
        } else {
          this.$alert.error('Debe llenar todos los campos requeridos.')
        }
      } catch (error) {
        console.log(error)
      }
    },
    formatearFormulario () {
      if (this.seguimiento.etapaDenuncia === this.patrocinioId) {
        let formulario = {}
        switch (this.seguimiento.idEtapaProcesal) {
          case this.preliminarId:
            formulario = {
              fechaInicio: this.seguimiento.fechaInicio,
              fechaFin: this.seguimiento.fechaFin,
              participantes: this.seguimiento.participantes,
              etapaDenuncia: this.seguimiento.etapaDenuncia,
              actuacion: this.seguimiento.actuacion,
              rolActual: this.seguimiento.rolActual,
              archivos: this.seguimiento.archivos,
              seAtendio: false,
              idEtapaProcesal: this.seguimiento.idEtapaProcesal,
              fechaPreliminar: this.seguimiento.fechaPreliminar,
              checksPreliminar: Object.keys(this.preliminarCheck).filter(key => this.preliminarCheck[key] === true)
            }
            break
          case this.rechazoObjecionId:
            formulario = {
              fechaInicio: this.seguimiento.fechaInicio,
              fechaFin: this.seguimiento.fechaFin,
              participantes: this.seguimiento.participantes,
              etapaDenuncia: this.seguimiento.etapaDenuncia,
              actuacion: this.seguimiento.actuacion,
              rolActual: this.seguimiento.rolActual,
              archivos: this.seguimiento.archivos,
              seAtendio: false,
              idEtapaProcesal: this.seguimiento.idEtapaProcesal,
              fechaRechazoCon: this.seguimiento.fechaRechazoCon,
              numeroResolucion: this.seguimiento.numeroResolucion
            }
            break
          case this.rechazoSinObjecionId:
            formulario = {
              fechaInicio: this.seguimiento.fechaInicio,
              fechaFin: this.seguimiento.fechaFin,
              participantes: this.seguimiento.participantes,
              etapaDenuncia: this.seguimiento.etapaDenuncia,
              actuacion: this.seguimiento.actuacion,
              rolActual: this.seguimiento.rolActual,
              archivos: this.seguimiento.archivos,
              seAtendio: false,
              idEtapaProcesal: this.seguimiento.idEtapaProcesal,
              fechaRechazoSin: this.seguimiento.fechaRechazoSin
            }
            break
          case this.preparatoriaImputacionId:
            formulario = {
              fechaInicio: this.seguimiento.fechaInicio,
              fechaFin: this.seguimiento.fechaFin,
              participantes: this.seguimiento.participantes,
              etapaDenuncia: this.seguimiento.etapaDenuncia,
              actuacion: this.seguimiento.actuacion,
              rolActual: this.seguimiento.rolActual,
              archivos: this.seguimiento.archivos,
              seAtendio: false,
              idEtapaProcesal: this.seguimiento.idEtapaProcesal,
              idDelitoImputacion: this.seguimiento.idDelitoImputacion,
              fechaImputacion: this.seguimiento.fechaImputacion,
              fechaMedidaCautelar: this.seguimiento.fechaMedidaCautelar,
              fechaAudiencia: this.seguimiento.fechaAudiencia,
              idMedidaCautelar: this.seguimiento.idMedidaCautelar,
              mesesDetencion: this.seguimiento.mesesDetencion,
              mesesAmpliacion: this.seguimiento.mesesAmpliacion,
              checksPreparatoria: Object.keys(this.preparatoriaCheck).filter(key => this.preparatoriaCheck[key] === true)
            }
            break
          case this.sobreseimientoImpugnacionId:
            formulario = {
              fechaInicio: this.seguimiento.fechaInicio,
              fechaFin: this.seguimiento.fechaFin,
              participantes: this.seguimiento.participantes,
              etapaDenuncia: this.seguimiento.etapaDenuncia,
              actuacion: this.seguimiento.actuacion,
              rolActual: this.seguimiento.rolActual,
              archivos: this.seguimiento.archivos,
              seAtendio: false,
              idEtapaProcesal: this.seguimiento.idEtapaProcesal,
              idDelitoConImpugnacion: this.seguimiento.idDelitoConImpugnacion,
              fechaConImpugnacion: this.seguimiento.fechaConImpugnacion,
              numeroResolucionConImpugnacion: this.seguimiento.numeroResolucionConImpugnacion
            }
            break
          case this.sobreseimientoSinImpugnacionId:
            formulario = {
              fechaInicio: this.seguimiento.fechaInicio,
              fechaFin: this.seguimiento.fechaFin,
              participantes: this.seguimiento.participantes,
              etapaDenuncia: this.seguimiento.etapaDenuncia,
              actuacion: this.seguimiento.actuacion,
              rolActual: this.seguimiento.rolActual,
              archivos: this.seguimiento.archivos,
              seAtendio: false,
              idEtapaProcesal: this.seguimiento.idEtapaProcesal,
              idDelitoSinImpugnacion: this.seguimiento.idDelitoSinImpugnacion,
              fechaSinImpugnacion: this.seguimiento.fechaSinImpugnacion,
              numeroResolucionSinImpugnacion: this.seguimiento.numeroResolucionSinImpugnacion
            }
            break
          case this.acusacionId:
            formulario = {
              fechaInicio: this.seguimiento.fechaInicio,
              fechaFin: this.seguimiento.fechaFin,
              participantes: this.seguimiento.participantes,
              etapaDenuncia: this.seguimiento.etapaDenuncia,
              actuacion: this.seguimiento.actuacion,
              rolActual: this.seguimiento.rolActual,
              archivos: this.seguimiento.archivos,
              seAtendio: false,
              idEtapaProcesal: this.seguimiento.idEtapaProcesal,
              fechaAcusacionFiscal: this.seguimiento.fechaAcusacionFiscal,
              fechaAcusacionParticular: this.seguimiento.fechaAcusacionParticular,
              fechaAcusacionDefensorias: this.seguimiento.fechaAcusacionDefensorias
            }
            break
          case this.juicioOralId:
            formulario = {
              fechaInicio: this.seguimiento.fechaInicio,
              fechaFin: this.seguimiento.fechaFin,
              participantes: this.seguimiento.participantes,
              etapaDenuncia: this.seguimiento.etapaDenuncia,
              actuacion: this.seguimiento.actuacion,
              rolActual: this.seguimiento.rolActual,
              archivos: this.seguimiento.archivos,
              seAtendio: false,
              idEtapaProcesal: this.seguimiento.idEtapaProcesal,
              fechaJuicioOral: this.seguimiento.fechaJuicioOral
            }
            break
          case this.sentenciaAbsolutoriaId:
            formulario = {
              fechaInicio: this.seguimiento.fechaInicio,
              fechaFin: this.seguimiento.fechaFin,
              participantes: this.seguimiento.participantes,
              etapaDenuncia: this.seguimiento.etapaDenuncia,
              actuacion: this.seguimiento.actuacion,
              rolActual: this.seguimiento.rolActual,
              archivos: this.seguimiento.archivos,
              seAtendio: false,
              idEtapaProcesal: this.seguimiento.idEtapaProcesal,
              idDelitoSentenciaAbsolutoria: this.seguimiento.idDelitoSentenciaAbsolutoria,
              fechaSentAbsolutoria: this.seguimiento.fechaSentAbsolutoria,
              numeroSentencia: this.seguimiento.numeroSentencia,
              idPresentoSentAbsolutoria: this.seguimiento.idPresentoSentAbsolutoria,
              recursoSentAbsolutoria: this.seguimiento.recursoSentAbsolutoria
            }
            break
          case this.sentenciaCondenatoriaId:
            formulario = {
              fechaInicio: this.seguimiento.fechaInicio,
              fechaFin: this.seguimiento.fechaFin,
              participantes: this.seguimiento.participantes,
              etapaDenuncia: this.seguimiento.etapaDenuncia,
              actuacion: this.seguimiento.actuacion,
              rolActual: this.seguimiento.rolActual,
              archivos: this.seguimiento.archivos,
              seAtendio: false,
              idEtapaProcesal: this.seguimiento.idEtapaProcesal,
              idDelitoSentenciaCondenatoria: this.seguimiento.idDelitoSentenciaCondenatoria,
              fechaSentencia: this.seguimiento.fechaSentencia,
              aniosSentencia: this.seguimiento.aniosSentencia,
              mesesSentencia: this.seguimiento.mesesSentencia,
              diasMulta: this.seguimiento.diasMulta,
              idPenal: this.seguimiento.idPenal
            }
            break
          case this.sentenciaMixtaId:
            formulario = {
              fechaInicio: this.seguimiento.fechaInicio,
              fechaFin: this.seguimiento.fechaFin,
              participantes: this.seguimiento.participantes,
              etapaDenuncia: this.seguimiento.etapaDenuncia,
              actuacion: this.seguimiento.actuacion,
              rolActual: this.seguimiento.rolActual,
              archivos: this.seguimiento.archivos,
              seAtendio: false,
              idEtapaProcesal: this.seguimiento.idEtapaProcesal,
              idDelitoSentenciaCondenatoriaMixta: this.seguimiento.idDelitoSentenciaCondenatoriaMixta,
              idDelitoSentenciaAbsolutoriaMixta: this.seguimiento.idDelitoSentenciaAbsolutoriaMixta,
              fechaSentMixta: this.seguimiento.fechaSentMixta
            }
            break
          case this.recursoId:
            formulario = {
              fechaInicio: this.seguimiento.fechaInicio,
              fechaFin: this.seguimiento.fechaFin,
              participantes: this.seguimiento.participantes,
              etapaDenuncia: this.seguimiento.etapaDenuncia,
              actuacion: this.seguimiento.actuacion,
              rolActual: this.seguimiento.rolActual,
              archivos: this.seguimiento.archivos,
              seAtendio: false,
              idEtapaProcesal: this.seguimiento.idEtapaProcesal,
              fechaPlanteamiento: this.seguimiento.fechaPlanteamiento,
              fechaNotificacion: this.seguimiento.fechaNotificacion
            }
            break
          case this.ejecucionId:
            formulario = {
              fechaInicio: this.seguimiento.fechaInicio,
              fechaFin: this.seguimiento.fechaFin,
              participantes: this.seguimiento.participantes,
              etapaDenuncia: this.seguimiento.etapaDenuncia,
              actuacion: this.seguimiento.actuacion,
              rolActual: this.seguimiento.rolActual,
              archivos: this.seguimiento.archivos,
              seAtendio: false,
              idEtapaProcesal: this.seguimiento.idEtapaProcesal,
              autoInterlocutorio: this.seguimiento.autoInterlocutorio
            }
            break
          default:
            break
        }
        this.seguimiento = formulario
      } else {
        const formulario = {
          fechaInicio: this.seguimiento.fechaInicio,
          fechaFin: this.seguimiento.fechaFin,
          participantes: this.seguimiento.participantes,
          etapaDenuncia: this.seguimiento.etapaDenuncia,
          actuacion: this.seguimiento.actuacion,
          fechaActuacion: this.seguimiento.fechaActuacion,
          rolActual: this.seguimiento.rolActual,
          archivos: this.seguimiento.archivos,
          seAtendio: false
        }
        this.seguimiento = formulario
      }
    },
    onReset () {
      this.$refs.seguimientoForm.reset()
    },
    factoryFn (file) {
      return {
        url: `${process.env.API_URL}denuncias/archivo`,
        method: 'POST',
        headers: [
          { name: 'Authorization', value: `Bearer ${this.$storage.get('token')}` }
        ]
      }
    },
    archivos (archivos, xhr) {
      const { datos } = JSON.parse(archivos.xhr.response)
      this.archivoSeleccionado.archivo = datos[0]
    },
    aniadirArchivo () {
      this.seguimiento.archivos.push({
        archivo: null,
        descripcion: null
      })
    },
    eliminarArchivo (index) {
      this.seguimiento.archivos.splice(index, 1)
    },
    seleccionArchivo (archivo) {
      this.archivoSeleccionado = archivo
    }
  }
}
</script>

<style scoped>
.auto-width {
  flex: 1;
  min-width: 0;
}
.align-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.justify {
  display: flex;
  justify-content: space-around;
}
</style>
